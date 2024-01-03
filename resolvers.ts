// deno-lint-ignore-file no-explicit-any
import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts";
import { load } from "https://deno.land/std@0.210.0/dotenv/mod.ts";
import { Brand, Fuel, Site, SitePrice } from './typedefs.ts';


await load({ export: true })
const client = new MongoClient();
const databaseUrl = Deno.env.get("DATABASE_URL")
await client.connect(`mongodb://${databaseUrl}`);

const db = client.database(Deno.env.get("DATABASE_NAME"));


interface IDetailedPositionPrice extends SitePrice {
  Fuel: Fuel
}

interface IDetailedPosition extends Site {
  brand: Brand,
  prices: IDetailedPositionPrice[]

}

interface IArgs {
  lat: number,
  lng: number,
  allowed_brands: Array<number>,
  allowed_fuels: Array<number>
}


export const resolvers = {
  Query: {
    detailedPositions: async (_: any, args: IArgs): Promise<{ fuels: Fuel[], sites: IDetailedPosition[] }> => {
      const sites = db.collection("sites");
      const fuels = db.collection('fuels');

      const aggregateSettings = [
        {
          $lookup: {
            from: "brands",
            localField: "BrandId",
            foreignField: "BrandId",
            as: "Brand"
          },
        },
        {
          $unwind: "$Brand"
        },
        {
          $lookup: {
            from: "sites_prices",
            localField: "SiteId",
            foreignField: "SiteId",
            pipeline: [
              {
                $sort: { TransactionDateUtc: -1 } // Sort prices by date in descending order
              },
              {
                $group: {
                  _id: "$FuelId",
                  LatestPrice: { $first: "$$ROOT" }
                }
              },
            ],
            as: "Prices"
          },
        },
        {
          $addFields: {
            distance: {
              $sqrt: {
                $sum: [
                  { $pow: [{ $subtract: ["$Lat", args.lat] }, 2] },
                  { $pow: [{ $subtract: ["$Lng", args.lng] }, 2] },
                ],
              },
            },
          },
        },
        { $sort: { distance: 1 } },
        { $limit: 50 }
      ];

      if (args.allowed_brands.length > 0) {
        aggregateSettings.push({
          // @ts-ignore
          $match: {
            "BrandId": { $in: args.allowed_brands }
          }
        },)
      }

      // if(args.allowed_fuels.length > 0) {

      // }

      const result = await sites.aggregate(aggregateSettings).toArray() as IDetailedPosition[]


      console.log(args)
      return {
        fuels: await fuels.find(args.allowed_fuels.length > 0 ? {
          "FuelId": { $in: args.allowed_fuels }
        } : undefined).toArray() as Fuel[],
        sites: result
      };
    },
  },
  Mutation: {
    addBrand: (_: any, brand: Brand) => {
      const brands = db.collection('brands');
      brands.updateOne({
        BrandId: brand.BrandId
      }, {
        $setOnInsert: brand
      }, { upsert: true })
    },
    addFuel: (_: any, fuel: Fuel) => {
      const fuels = db.collection('fuels');
      fuels.updateOne({
        FuelId: fuel.FuelId
      }, {
        $setOnInsert: fuel
      }, { upsert: true })
    },
    addSite: (_: any, site: Site) => {
      const sites = db.collection('sites');
      sites.updateOne({
        SiteId: site.SiteId
      }, {
        $setOnInsert: site,
      }, { upsert: true })
    },
    addSitePrice: (_: any, sitePrice: SitePrice) => {
      const sitesPrices = db.collection('sites_prices');
      sitesPrices.updateOne({
        SiteId: sitePrice.SiteId,
        FuelId: sitePrice.FuelId,
        TransactionDateUtc: sitePrice.TransactionDateUtc
      }, {
        $setOnInsert: sitePrice,
      }, { upsert: true })
    }

  }
}