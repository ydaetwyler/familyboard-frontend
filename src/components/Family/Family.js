import React, { useState, useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import UpdateFamily from './UpdateFamily'

const GET_FAMILY = gql`
    query GetFamily {
        getFamily {
            _id,
            familyName,
            familyAvatarUrl,
            familyMembers {
                userName,
                avatarUrl,
                active
            }
        }
    }
`

const FAMILY_SUBSCRIPTION = gql`
    subscription FamilyChanged($_id: ID!) {
        familyChanged(_id: $_id) {
            familyName,
            familyAvatarUrl
        }
    }
`

const Family = ({ familyID }) => {
    const { loading, error, data, subscribeToMore } = useQuery(GET_FAMILY)
    const [clicked, setClicked] = useState(false)

    useEffect(() => {
        subscribeToMore({
            document: FAMILY_SUBSCRIPTION,
            variables: { _id: familyID },
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev
                const newFamily = subscriptionData.data.familyChanged

                return {
                    getFamily: {...prev.getFamily, ...newFamily}
                }
            }
        })
    }, [])

    if (loading) return <img src="/icons/loading.png" className="animate-spin h-9 w-9" />
    if (error) return JSON.stringify(error, null, 2)

    return (
        <div>
            <div className="group flex flex-col pr-8 items-center cursor-pointer" onClick={() => setClicked(true)}>
                <img src={data.getFamily.familyAvatarUrl} className="h-10 w-12 group-hover:animate-bounce" />
                <p className="-mt-1 text-center text-sm text-white font-medium font-['Mulish'] opacity-70 group-hover:opacity-100">
                    {data.getFamily.familyName}
                </p>
            </div>
            <UpdateFamily 
                familyID={familyID}
                clicked={clicked}
                setClicked={setClicked}
                initialFamily={data.getFamily.familyName} 
                initialAvatar={data.getFamily.familyAvatarUrl}
                familyMembers={data.getFamily.familyMembers}
            />
        </div>
    )
}

export default Family