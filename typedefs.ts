import { gql } from "https://deno.land/x/graphql_tag@0.0.1/mod.ts";



export interface QueryResult {
  name: string,
  address: string,
  lat: number,
  long: number,
  brand_name: string,
  distance_km: number,
  distance_by_road_km: number
}

export interface Brand {
  BrandId: number,
  Name: string
}

export interface Fuel {
  FuelId: number,
  Name: string
}

export interface Site {
  SiteId: number,
  Address: string,
  Name: string,
  BrandId: number,
  PostCode: string,
  Lat: number,
  Lng: number,
  LastModified: string,
  GooglePlaceId: string
}

export interface SitePrice {
  SiteId: number,
  FuelId: number,
  CollectionMethod: string,
  TransactionDateUtc: string,
  Price: number
}



// export const typeDefs = gql`
//   type Query {
//     detailedPositions(lat: Float, long: Float): [QueryResult]
//   }

//   type QueryResult {
//     name: String,
//     address: String,
//     lat: Float,
//     long: Float,
//     brand_name: String,
//     distance_km: Float,
//     distance_by_road_km: Float
//   }

//   type Brand {
//     BrandId: String,
//     Name: String
//   }

//   interface IBrand {}
//   interface IFuel {}
//   interface ISite {}
//   interface ISitePrice {}

//   type Mutation {
//     addBrand(brand: IBrand),
//     addFuel(fuel: IFuel),
//     addSite(site: ISite),
//     addSitePrice(sitePrice: ISitePrice),
//   }
// `;
