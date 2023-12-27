import { gql } from "https://deno.land/x/graphql_tag@0.0.1/mod.ts";

export const typeDefs = gql`
  type Query {
    getForPos(lat: Float, long: Float): [QueryResult]
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
    id: String,
    name: String
  }


  type Mutation {
    addBrand(brand_id: String): Brand,
  }
`;


// addPlace(),
//   addFuelType(),
//   addPlaceFuelType(),
//   addPlaceFuelPrice(),
