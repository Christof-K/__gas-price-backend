import { load } from "https://deno.land/std@0.210.0/dotenv/mod.ts";
import { makeExecutableSchema } from 'https://deno.land/x/graphql_tools@0.0.2/mod.ts';
import { resolvers } from './resolvers.ts';
import { Brand, typeDefs } from './typedefs.ts';
await load({ export: true })


const baseUrl = "https://fppdirectapi-prod.fuelpricesqld.com.au";
const resources = {
  brands: "Subscriber/GetCountryBrands?countryId=21",
  // "Subscriber/GetCountryFuelTypes?countryId=21",
  // "Subscriber/GetFullSiteDetails?countryId=21&geoRegionLevel=3&geoRegionId=1",
  // "Price/GetSitesPrices?countryId=21&geoRegionLevel=3&geoRegionId=1"
}



Object.entries(resources).forEach(([resourceName, resource]) => {
  fetch(`${baseUrl}/${resource}`, {
    headers: {
      Authorization: `FPDAPI SubscriberToken=${Deno.env.get("API_TOKEN")}`
    }
  }).then((result) => {
    return result.json();
  }).then((data) => {
    switch (resourceName) {
      case "brands": {
        const brands = data.Brands as Array<Brand>
        brands.forEach(brand => {
          resolvers.Mutation.addBrand(null, brand);
        })
        break;
      }
    }
  })
})
