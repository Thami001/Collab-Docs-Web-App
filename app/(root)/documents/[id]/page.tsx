import React from 'react';
import CollabRoom from "@/components/collabRoom";
import {currentUser} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {getDocument} from "@/lib/actions/room.actions";
import {getClerkUsers} from "@/lib/actions/user.actions";



const Document =async({params: {id}} : SearchParamProps) => {
    const clerkUser = await currentUser()


    if (!clerkUser)
        redirect(`/sign-in`)


    const room = await getDocument({
        roomId: id,
        userId: clerkUser.emailAddresses[0].emailAddress
    })

    if(!room)
        redirect(`/`)


    const userIds = Object.keys(room.usersAccesses)
    const users = await getClerkUsers({userIds})

    const usersData = users.map((user: User) => ({
        ...user,
        userType: room.usersAccesses[user.email]?.includes('room:write') ? 'editor' : 'viewer'
    }))

    const currentUserType = room.usersAccesses[clerkUser.emailAddresses[0].emailAddress]?.includes('users:write') ? 'editor' : 'viewer';

    return (
        <main className={"flex w-full flex-col items-center"}>
            <CollabRoom roomId={id} roomMetadata={room.metadata} currentUserType={currentUserType} users={usersData}/>
        </main>
    );
};

export default Document;