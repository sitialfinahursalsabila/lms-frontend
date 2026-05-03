import React, { useEffect, useReducer, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { apiUrl, token } from '../../../common/Config';
import UpdateChapter from './UpdateChapter';
import Accordion from 'react-bootstrap/Accordion';
import CreateLesson from './CreateLesson';
import { Link } from 'react-router-dom';
import { FaPlus } from "react-icons/fa";
import { BsPencilSquare } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";

const ManageChapter = ({ course, params }) => {

    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const [chapterData, setChapterData] = useState([]);

    // update chapter modal
    const [showChapter, setShowChapter] = useState(false);
    const handleClose = () => setShowChapter(false);
    const handleShow = (chapter) => {
        setShowChapter(true);
        setChapterData(chapter);
    }

    // update lesson modal
    const [showLessonModal, setShowLessonModal] = useState(false);
    const handleCloseLessonModal = () => setShowLessonModal(false);
    const handleShowLessonModal = () => {
        setShowLessonModal(true);
    }

    const chapterReducer = (state, action) => {
        switch (action.type) {
            case "SET_CHAPTERS":
                return action.payload;
            case "ADD_CHAPTER":
                return [...state, action.payload]
            case "UPDATE_CHAPTER":
                return state.map(chapter => {
                    if (chapter.id === action.payload.id) {
                        return action.payload;
                    }
                    return chapter;
                })
            case "DELETE_CHAPTER":
                return state.filter(chapter => chapter.id != action.payload)

            default:
                return state;
        }
    }
    const [chapters, setChapters] = useReducer(chapterReducer, []);

    const onSubmit = async (data) => {
        setLoading(true)
        const formData = { ...data, course_id: params.id }
        await fetch(`${apiUrl}/chapters`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(result => {
                setLoading(false)
                if (result.status === 200) {
                    // const newChapters = [...chapters, result.data]
                    // setChapters(newChapters)
                    setChapters({ type: "ADD_CHAPTER", payload: result.data })
                    toast.success(result.message)
                    reset()
                } else {
                    console.log("something went wrong")
                }
            });
    }

    const deleteChapter = async (id) => {
        if (confirm("Are you sure want to delete?")) {
            await fetch(`${apiUrl}/chapters/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(result => {
                    setLoading(false)
                    if (result.status === 200) {
                        setChapters({ type: "DELETE_CHAPTER", payload: id })
                        toast.success(result.message)
                        reset()
                    } else {
                        console.log("something went wrong")
                    }
                });
        }
    }

    useEffect(() => {
        if (course.chapters) {
            setChapters({ type: "SET_CHAPTERS", payload: course.chapters })
        }
    }, [course])

    return (
        <>
            <div className='card shadow-lg border-0 mt-4'>
                <div className='card-body p-4'>
                    <div className='d-flex justify-content-between w-100' >
                        <h4 className="h5 mb-3">Chapter</h4>
                        <Link onClick={handleShowLessonModal}><FaPlus size={12} /> <strong>Add Lesson</strong></Link>
                    </div>
                    <form className='mb-3' onSubmit={handleSubmit(onSubmit)}>
                        <div className='mb-3'>
                            <input
                                {...register("chapter", {
                                    required: "The chapter field is required."
                                })}
                                type="text"
                                className={`form-control ${errors.chapter && 'is-invalid'}`}
                                placeholder='Chapter'
                            />
                        </div>
                        <button
                            disabled={loading}
                            className='btn btn-primary mb-3'
                        >
                            {loading === false ? 'Save' : 'Please wait...'}
                        </button>
                    </form>
                    <Accordion>
                        {
                            chapters.map((chapter, index) => {
                                return (
                                    <Accordion.Item eventKey={index.toString()} key={chapter.id || index}>
                                        <Accordion.Header>{chapter.chapter || chapter.title}</Accordion.Header>
                                        <Accordion.Body>
                                            <div className='row'>
                                                <div className='col-md-12'>
                                                    <div className="d-flex justify-content-between mb-2 mt-4">
                                                        <h4 className="h5">Lessons</h4>
                                                        <a className="h6" href="#" data-discover="true">
                                                            <strong>Reorder Lessons</strong>
                                                        </a>
                                                    </div>
                                                </div>

                                                <div className='col-md-12'>
                                                    {
                                                        chapter.lessons && chapter.lessons.map(lesson => {
                                                            return (
                                                                <div className='card shadow px-3 py-2 mb-2'>
                                                                    <div className='row'>
                                                                        <div className='col-md-7'>
                                                                            {lesson.title}
                                                                        </div>

                                                                        <div className='col-md-5 text-end'>
                                                                            {
                                                                                lesson.duration > 0 && <small className='fw-bold text-muted me-2'>20 </small>
                                                                            }
                                                                            {
                                                                                lesson.is_free_preview == "yes" && <span className='badge bg-success'>Preview</span>
                                                                            }

                                                                            <Link to={`/account/courses/edit-lesson/${lesson.id}/${course.id}`} className='ms-2'>
                                                                                <BsPencilSquare />
                                                                            </Link>

                                                                            <Link className='ms-2 text-danger'>
                                                                                <FaTrashAlt />
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>

                                                <div className='col-md-12 mt-3'>
                                                    <div className='d-flex'>
                                                        <button
                                                            onClick={() => deleteChapter(chapter.id)}
                                                            className='btn btn-danger btn-sm'
                                                        >
                                                            Delete Chapter
                                                        </button>
                                                        <button
                                                            onClick={() => handleShow(chapter)}
                                                            className='btn btn-primary btn-sm ms-2'
                                                        >
                                                            Update Chapter
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                )
                            })
                        }
                    </Accordion>
                </div >
            </div >

            <UpdateChapter
                chapterData={chapterData}
                showChapter={showChapter}
                handleClose={handleClose}
                chapters={chapters}
                setChapters={setChapters}
            />

            <CreateLesson
                showLessonModal={showLessonModal}
                handleCloseLessonModal={handleCloseLessonModal}
                course={course}
                chapters={chapters}
                setChapters={setChapters}
            />
        </>
    )
}

export default ManageChapter