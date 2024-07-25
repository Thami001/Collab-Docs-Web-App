"use client"

import {useState} from "react";
import {useSelf} from "@liveblocks/react/suspense";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import UserTypeSelector from "@/components/userTypeSelector";
import Collaborators from "@/components/collaborators";
import {updateDocumentAccess} from "@/lib/actions/room.actions";





const ShareModel = ({roomId, currentUserType, creatorId, collaborators} : ShareDocumentDialogProps) => {
    const user = useSelf()

    const [open, setIsOpen] = useState(false)
    const [loading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("");
    const [userType, setUserType] = useState<UserType>('viewer')

    const shareDocumentHandler = async() => {
        setIsLoading(true)

        await updateDocumentAccess({
            roomId,
            email,
            userType: userType as UserType,
            updatedBy: user.info
        })

        setIsLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={setIsOpen}>
            <DialogTrigger>
                <Button className={"gradient-blue flex h-9 gap-1 px-4"} disabled={currentUserType !== 'editor'}>
                    <Image src={"/assets/icons/share.svg"} alt={"Share"} width={20} height={20} className={"min-w-4 md:size-5"}/>
                    <p className={"mr-1 hidden sm:block"}>
                        Share
                    </p>
                </Button>
            </DialogTrigger>
            <DialogContent className={"shad-dialog"}>
                <DialogHeader>
                    <DialogTitle>Manage who can view this project</DialogTitle>
                    <DialogDescription>
                        Select which users can view and edit this document
                    </DialogDescription>
                </DialogHeader>
                <Label htmlFor="email" className={"mt-6 text-blue-100"}>
                    Email Address
                </Label>
                <div className={"flex items-center gap-3"}>
                    <div className={"flex flex-1 rounded-md bg-dark-400"}>
                        <Input id={"email"} placeholder={"Enter Email Address"} value={email} onChange={(e) => setEmail(e.target.value)} className={"share-input"}/>
                        <UserTypeSelector userType={userType} setUserType={setUserType} />
                    </div>
                    <Button type={"submit"} onClick={shareDocumentHandler} className={"gradient-blue flex h-full gap-1 px-5"} disabled={loading}>
                        {loading ? 'Sending...': 'Invite'}
                    </Button>
                </div>
                <div className={"my-2 space-y-2"}>
                    <ul className={"flex flex-col"}>
                        {collaborators.map((collaborator) => (
                            <Collaborators key={collaborator.id} collaborator={collaborator} email={collaborator.email} user={user.info} roomId={roomId} creatorId={creatorId}/>
                        ))}
                    </ul>
                </div>
            </DialogContent>
        </Dialog>

    );
};

export default ShareModel;