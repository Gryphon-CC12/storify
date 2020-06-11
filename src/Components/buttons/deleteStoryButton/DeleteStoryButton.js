import React from 'react';
import deleteOneStory from '../../../utils/deleteOneStory';

export default function DeleteStoryButton(props) {
    const clickHandler = () => {
        deleteOneStory(props.storyId);
    }

    return (
        <button
            className="btn btn-danger"
            onClick={clickHandler}
        >

        </button>
    )
}