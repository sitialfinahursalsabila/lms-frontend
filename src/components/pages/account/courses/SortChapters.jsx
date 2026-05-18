import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { apiUrl, token } from '../../../common/Config';

const SortChapters = ({ showChapterSortModal, handleCloseChapterSortModal, course, setChapters, chapters }) => {
    const [chaptersData, setChaptersData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { handleSubmit, reset } = useForm();

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(chaptersData);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        setChaptersData(reorderedItems);
        saveOrder(reorderedItems);
    };

    const saveOrder = async (updatedChapters) => {
        setLoading(true);
        await fetch(`${apiUrl}/sort-chapters`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token()}`
            },
            body: JSON.stringify({ chapters: updatedChapters })
        })
            .then(res => res.json())
            .then(result => {
                setLoading(false);
                if (result.status === 200) {
                    setChapters({ type: "SET_CHAPTERS", payload: result.chapters });
                    toast.success(result.message);
                    reset();
                } else {
                    toast.error(result.message ?? "Something went wrong.");
                }
            });
    };

    const onSubmit = () => {
        saveOrder(chaptersData);
    };

    useEffect(() => {
        if (chapters) {
            setChaptersData(chapters);
        }
    }, [chapters])

    return (
        <>
            <Modal size='lg' show={showChapterSortModal} onHide={handleCloseChapterSortModal}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Sort Chapters</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="list">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                        {
                                            chaptersData.map((chapter, index) => (
                                                <Draggable key={chapter.id} draggableId={`${chapter.id}`} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="mt-2 border px-3 py-2 bg-white shadow-lg rounded"
                                                        >
                                                            {chapter.title}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                        }
                                        {provided.placeholder}
                                    </div>
                                )}

                            </Droppable>
                        </DragDropContext>
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? "Saving..." : "Save Order"}
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    );
};

export default SortChapters;
