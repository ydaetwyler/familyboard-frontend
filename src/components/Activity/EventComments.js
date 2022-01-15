import React, { useState, useEffect } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'

import { getExtraShortDate, getTime } from '../../utils/dateHelpers.js'

import { REMOVE_EVENT_COMMENT } from '../../utils/mutations'

const GET_EVENT_COMMENT = gql`
    query GetEventComment($_id: ID!) {
        getEventComment(_id: $_id) {
            commentText,
            createdAt,
            commentOwner {
                userName
            }
        }
    }
`

const CHECK_COMMENT_OWNER = gql`
    query checkCommentOwner($_id: ID!) {
        checkCommentOwner(_id: $_id)
    }
`

const EventComments = ({ id, eventId }) => {
    const [fail, setFail] = useState()
    const [isCommentOwner, setIsCommentOwner] = useState(false)
    const { loading, error, data, refetch, subscribeToMore } = useQuery(GET_EVENT_COMMENT, {
        variables: { _id: id }
    })
    const { loading: checkCommentOwnerLoading, error: checkCommentOwnerError, data: checkCommentOwnerData, refetch: checkCommentOwnerRefetch, subscribeToMore: checkCommentOwnerSubscribeToMore } = useQuery(CHECK_COMMENT_OWNER, {
        variables: { _id: id }
    })
    const [removeEventComment] = useMutation(REMOVE_EVENT_COMMENT, {
        onError: () => setFail(true)
    })

    useEffect(() => {
        if (checkCommentOwnerData) 
            checkCommentOwnerData.checkCommentOwner
                ? setIsCommentOwner(true)
                : setIsCommentOwner(false)
    }, [checkCommentOwnerData])

    const handleRemoveEventComment = () => {
        removeEventComment({ 
            variables: {
                commentId: id,
                _id: eventId
            } 
        })
    }

    return (
        <div>
            <div className="flex flex-row flex-nowrap items-start w-full mt-5">
                <div className="flex flex-col w-1/4 items-center">
                    <p className="text-gray-200 text-sm font-medium">
                        {data ? data.getEventComment.commentOwner.userName : null}
                    </p>
                    <p className="text-gray-200 text-xs font-light">
                        {data ? getExtraShortDate(data.getEventComment.createdAt) : null}
                    </p>
                    <p className="text-gray-200 text-xs font-light">
                        {data ? getTime(data.getEventComment.createdAt) : null}
                    </p>
                </div>
                <div className="pl-2 flex flex-col w-3/4">
                    <p className="text-white text-base font-light">
                        {data ? data.getEventComment.commentText : null}
                    </p>
                    {isCommentOwner 
                        ?   <button 
                                className="text-gray-400 text-sm font-light text-right -mt-2"
                                onClick={handleRemoveEventComment}
                            >
                                delete
                            </button> 
                        : null
                    }
                </div>
            </div>
        </div>
    )
}

export default EventComments