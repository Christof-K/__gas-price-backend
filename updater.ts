import { load } from "https://deno.land/std@0.210.0/dotenv/mod.ts";
import { resolvers } from './resolvers.ts';
import { Brand, Fuel, SitePrice } from './typedefs.ts';
await load({ export: true })

const baseUrl = "https://fppdirectapi-prod.fuelpricesqld.com.au";
enum ResourceTypes {
  brands = "brands",
  fuelTypes = "fuel_types",
  sites = "sites",
  sitesPrices = "sites_prices"
}

const resources = {
  [ResourceTypes.brands]: "Subscriber/GetCountryBrands?countryId=21",
  [ResourceTypes.fuelTypes]: "Subscriber/GetCountryFuelTypes?countryId=21",
  [ResourceTypes.sites]: "Subscriber/GetFullSiteDetails?countryId=21&geoRegionLevel=3&geoRegionId=1",
  [ResourceTypes.sitesPrices]: "Price/GetSitesPrices?countryId=21&geoRegionLevel=3&geoRegionId=1"
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
      case ResourceTypes.brands: {
        const brands = data.Brands as Array<Brand>
        brands.forEach(brand => {
          resolvers.Mutation.addBrand(null, brand);
        })
        break;
      }
      case ResourceTypes.fuelTypes: {
        const fuels = data.Fuels as Array<Fuel>
        fuels.forEach(fuel => {
          resolvers.Mutation.addFuel(null, fuel);
        })
        break;
      }
      case ResourceTypes.sites: {
        const sites = data.S as Array<{
          S: number, // id
          A: string, // address
          N: string, // name
          B: number, // brandId
          P: string, // postcode
          Lat: number,
          Lng: number,
          M: string, // last modified - date string
          GPI: string, // google place id
        }>
        sites.forEach(_site => {
          resolvers.Mutation.addSite(null, {
            SiteId: _site.S,
            Address: _site.A,
            Name: _site.N,
            BrandId: _site.B,
            PostCode: _site.P,
            Lat: _site.Lat,
            Lng: _site.Lng,
            LastModified: _site.M,
            GooglePlaceId: _site.GPI
          })
        })
        break;
      }
      case ResourceTypes.sitesPrices: {
        const sitesPrices = data.SitePrices as Array<SitePrice>
        sitesPrices.forEach(item => {
          resolvers.Mutation.addSitePrice(null, item);
        })
      }
    }
  })
})
