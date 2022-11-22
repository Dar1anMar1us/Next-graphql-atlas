import { ApolloServer } from "apollo-server-micro";
import { MicroRequest } from "apollo-server-micro/dist/types";
import { ServerResponse, IncomingMessage } from "http";
import { buildSchema, Resolver, Query, Arg, ObjectType, Field, ID } from "type-graphql";
import "reflect-metadata";

@ObjectType()
export class Client {
    @Field(() => ID)
    name: string | undefined;

    @Field(() => String)
    email: string | undefined;

    @Field(() => String)
    phone: string | undefined;
}

@ObjectType()
export class Project {
    @Field(() => ID)
    name: string | undefined;

    @Field(() => String)
    description: string | undefined;

    @Field(() => String)
    status: string | undefined;

    @Field(() => Client)
    client: Client | undefined
}

@Resolver(Client)
export class ClientsResolver {
    @Query(() => [Client])
    clients(): Client[] {
        return [
            { name: "Darian", email: "dmc.41155@gmail.com", phone: "654567543" },
            { name: "Chirca", email: "dmc.41155@gmail.com", phone: "654567543" }
        ]
    }
}

@Resolver(Project)
export class ProjectsResolver {
    @Query(() => [Project])
    projects(): Project[] {
        return [
            { name: "Test project", description: "Test description...", status: "active", client: {name: "Darian", email: "dmc.41155@gmail.com", phone: "654567543"} }
        ]
    }
}

const schema = await buildSchema({
    resolvers: [
        ClientsResolver,
        ProjectsResolver
    ]
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