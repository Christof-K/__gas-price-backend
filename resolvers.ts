// deno-lint-ignore-file no-explicit-any
import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts";
import { load } from "https://deno.land/std@0.210.0/dotenv/mod.ts";
import { Brand } from './typedefs.ts';


await load({ export: true })
const client = new MongoClient();
const databaseUrl = Deno.env.get("DATABASE_URL")
await client.connect(`mongodb://${databaseUrl}`);

const db = client.database(Deno.env.get("DATABASE_NAME"));

export const resolvers = {
  Query: {
    detailedPositions: (_: any, args: {lat: number, long: number}) => {
      console.log('---getForPos', args.lat, args.long);
      const positions = db.collection("positions");
      positions.aggregate([{
        $lookup: {
          from: "brands",
          local_field: "brand_id",
          foreignField: "id",
          as: "brands"
        }
      }])
      return [{name: "test"}, {name: "xxx"}]
    },
    // placeByApiId: (_:any, args: any) => {

    // },
  },
  Mutation: {
    addBrand: (_: any, brand: Brand) => {
      const brands = db.collection('brands');
      brands.updateOne({
        BrandId: brand.BrandId
      }, {
        $setOnInsert: brand
      }, {upsert: true})
    },
    // addPlace: (_: any, args: any) => {
    //   const places = db.collection('places');
    //   places.insertOne({
    //     id: "",
    //     lat: "",
    //     long: "",
    //     name: "",
    //     address: "",
    //     brand_id: ""
    //   })
    // },
    // addFuelType: (_: any, args: any) => {},
    // addPlaceFuelType: (_: any, args: any) => {},
    // addPlaceFuelPrice: (_: any, args: any) => {},
  }
}