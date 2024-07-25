"use client"

import {ClientSideSuspense, RoomProvider} from "@liveblocks/react/suspense";
import Loader from "@/components/loader";
import Header from "@/components/header";
import {SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/nextjs";
import {Editor} from "@/components/editor/Editor";
import ActiveCollabs from "@/components/activeCollabs";
import {useEffect, useRef, useState} from "react";
import {Input} from "@/components/ui/input";
import Image from "next/image";
import {updateDocument} from "@/lib/actions/room.actions";
import ShareModel from "@/components/shareModel";


const CollabRoom = ({roomId, roomMetadata, users, currentUserType} : CollaborativeRoomProps) => {
    const [editing, setIsEditing] = useState(false)
    const [loading, setIsLoading] = useState(false)
    const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);
    const containerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)


    const updateTitleHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === "Enter") {
            setIsLoading(true)
        }

        try {
            if(documentTitle !== roomMetadata.title){
                const updatedDocument = await updateDocument(roomId, documentTitle)

                if(updatedDocument){
                    setIsEditing(false)
                }
            }

        }catch (error)
        {
         console.error(error)
        }
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if(containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsEditing(false)
                updateDocument(roomId, documentTitle)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [roomId, documentTitle])

    useEffect(() => {
        if(editing && inputRef.current){
            inputRef.current.focus();
        }
    }, [editing])

    return (
        <RoomProvider id={roomId}>
            <ClientSideSuspense fallback={<Loader/>}>
                <div className={"collaborative-room"}>
                    <Header>
                        <div ref={containerRef} className={"flex w-fit items-center justify-center gap-2"}>
                            {editing && !loading ? (
                                <Input type={"text"} value={documentTitle} ref={inputRef} placeholder={"Enter Title"} onChange={(e) => setDocumentTitle(e.target.value)} onKeyDown={updateTitleHandler} disabled={!editing} className={"document-title-input"}/>
                            ): (<>
                                <p className={"document-title"}>
                                    {documentTitle}
                                </p>
                            </>)}

                            {currentUserType === "editor" && !editing && (
                                <Image src={"/assets/icons/edit.svg"} alt={"edit"} width={24} height={24} onClick={() => setIsEditing(true)} className={"pointer"}/>
                            )}

                            {currentUserType !== "editor" && !editing && (
                                <p className={"view-only-tag"}>View Only</p>
                            )}

                            {loading && <p className={"text-sm text-gray-400"}>Saving...</p>}
                        </div>
                        <div className={"flex w-full flex-1 justify-end gap-2 sm:gap-3"}>
                            <ActiveCollabs />
                            <ShareModel roomId={roomId} collaborators={users} creatorId={roomMetadata.creatorId} currentUserType={currentUserType}/>
                            <SignedOut>
                                <SignInButton/>
                            </SignedOut>
                            <SignedIn>
                                <UserButton/>
                            </SignedIn>
                        </div>
                    </Header>
                    <Editor roomId={roomId} currentUserType={currentUserType}/>
                </div>
            </ClientSideSuspense>
        </RoomProvider>
    );
};

export default CollabRoom;