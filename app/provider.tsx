"use client"

import {ClientSideSuspense, LiveblocksProvider, RoomProvider} from "@liveblocks/react/suspense";
import {ReactNode} from "react";
import Loader from "@/components/loader";
import { getClerkUsers } from "@/lib/actions/user.actions";
import {getDocumentUsers} from "@/lib/actions/room.actions";
import {useUser} from "@clerk/nextjs";


const Provider = ({children} : {children: ReactNode}) => {
    const {user: clerkUser} = useUser()

    return (
        <LiveblocksProvider authEndpoint={"/api/liveblocks-auth"}
        resolveUsers={async({userIds}) => {
            const users = getClerkUsers({userIds})

            return users
        } } resolveMentionSuggestions={async({text, roomId}) => {
            const roomUsers = await getDocumentUsers({
                roomId,
                currentUser: clerkUser?.emailAddresses[0].emailAddress!,
                text
            })

            return roomUsers
        }}>

            <ClientSideSuspense fallback={<Loader/>}>
        {children}
            </ClientSideSuspense>
            </LiveblocksProvider>
    );
};

export default Provider;