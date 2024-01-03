import { Server } from "https://deno.land/std@0.166.0/http/server.ts";
// import { GraphQLHTTP } from "https://deno.land/x/gql@1.1.2/mod.ts";
// import { makeExecutableSchema } from "https://deno.land/x/graphql_tools@0.0.2/mod.ts";
// import { typeDefs } from './typedefs.ts';
import { resolvers } from './resolvers.ts';
import { load } from 'https://deno.land/std@0.210.0/dotenv/mod.ts';
await load({ export: true })

// const schema = makeExecutableSchema({ resolvers, typeDefs })
const server = new Server({
  handler: async (req) => {
    const { pathname } = new URL(req.url);

    switch (pathname) {
      // case "/graphql": {
      //   return await GraphQLHTTP<Request>({
      //     schema,
      //     graphiql: true,
      //   })(req)
      // }
      case "/detailed-positions": {

        const headers = {
          "Access-Control-Allow-Origin": Deno.env.get("CLIENT_URL") ?? "",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "POST, OPTIONS"
        }

        if(req.method === "OPTIONS") {
          return new Response(null, {
            headers
          })
        }

        const args = await req.json();
        const result = await resolvers.Query.detailedPositions(null, args)
        return Response.json(result, {
          headers: headers
        });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
  port: 3001,
});

server.listenAndServe();