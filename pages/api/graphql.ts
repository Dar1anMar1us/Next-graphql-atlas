import { ApolloServer } from "apollo-server-micro";
import { MicroRequest } from "apollo-server-micro/dist/types";
import { ServerResponse, IncomingMessage } from "http";
import { buildSchema, Resolver, Query, Arg, ObjectType, Field, ID } from "type-graphql";
import "reflect-metadata";

@ObjectType()
export class Client {
    @Field(() => ID)
    name: string | undefined;
}

@Resolver(Client)
export class ClientsResolver {
    @Query(() => [Client])
    clients(): Client[] {
        return [
            { name: "Darian" },
            { name: "Chirca" }
        ]
    }
}

const schema = await buildSchema({
    resolvers: [ClientsResolver]
})

const server = new ApolloServer({
    schema
})

export const config = {
    api: {
        bodyParser: false
    }
}

const startServer = server.start()

export default async function handler(req: MicroRequest, res: ServerResponse<IncomingMessage>) {
    await startServer
    await server.createHandler({ path: "/api/graphql" })(req, res)
}