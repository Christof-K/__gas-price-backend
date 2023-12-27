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
  BrandId: string,
  Name: string
}


export const typeDefs = gql`
  type Query {
    detailedPositions(lat: Float, long: Float): [QueryResult]
  }

  type QueryResult {
    name: String,
    address: String,
    lat: Float,
    long: Float,
    brand_name: String,
    distance_km: Float,
    distance_by_road_km: Float
  }

  type Brand {
    BrandId: String,
    Name: String
  }

  type Mutation {
    addBrand(brand_id: String): Brand,
  }
`;


// addPlace(),
//   addFuelType(),
//   addPlaceFuelType(),
//   addPlaceFuelPrice(),
