import {useState} from 'react';
import Image from "next/image";
import UserTypeSelector from "@/components/userTypeSelector";
import {Button} from "@/components/ui/button";
import {removeCollaborator, updateDocumentAccess} from "@/lib/actions/room.actions";

const Collaborators = ({roomId,collaborator,creatorId, user, email} : CollaboratorProps) => {
    const [userType, setUserType] = useState(collaborator.userType || 'viewer')
    const [loading, setIsLoading] = useState(false)

    const shareDocumentHandler = async(type: string) => {
       setIsLoading(true)

        await updateDocumentAccess({
            roomId,
            email,
            userType: type as UserType,
            updatedBy: user
        })

        setIsLoading(false)
    }

    const removeCollaboratorHandler = async(email: string) => {
        setIsLoading(true)

        await removeCollaborator({
            roomId,
            email
        })

        setIsLoading(false)
    }
    return (
        <li className={"flex items-center justify-between gap-2 py-3"}>
           <div className={"flex gap-2"}>
               <Image src={collaborator.avatar} alt={collaborator.name} width={36} height={36} className={"size-9 rounded-full"}/>
               <div>
                   <p className={"line-clamp-1 text-sm font-semibold leading-4 text-white"}>
                       {collaborator.name}
                       <span className={"text-10-regular pl-2 text-blue-100"}>
                           {loading && 'updating...'}
                       </span>
                   </p>
                   <p className={"text-sm font-light text-blue-100"}>
                       {collaborator.email}
                   </p>
               </div>
           </div>
            {creatorId  === collaborator.id ? (
                <p className={"text-sm text-blue-100"}>
                    Owner
                </p>
            ): (
                <div className={"flex items-center"}>
                    <UserTypeSelector userType={userType} setUserType={setUserType || 'viewer'} onClickHandler={shareDocumentHandler}/>
                    <Button type={"button"} onClick={() => removeCollaboratorHandler(collaborator.email)}>
                        Remove
                    </Button>
                </div>
            )}
        </li>
    );
};

export default Collaborators;