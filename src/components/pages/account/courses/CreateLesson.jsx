import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { apiUrl, token } from '../../../common/Config';

const CreateLesson = ({ showLessonModal, handleCloseLessonModal, course, chapters, setChapters }) => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        await fetch(`${apiUrl}/lessons`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token()}`
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(result => {
                setLoading(false);
                if (result.status === 200) {
                    toast.success(result.message);
                    reset({
                        chapter: '',
                        lesson: '',
                        status: 1
                    }
                    );
                    handleCloseLessonModal();
                } else {
                    console.log("something went wrong");
                }
            });
    }

    return (
        <>
            <Modal size='lg' show={showLessonModal} onHide={handleCloseLessonModal}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Lesson</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='mb-3'>
                            <label className='form-label'>Chapter</label>
                            <select
                                {
                                ...register('chapter', {
                                    required: "Please select a Chapter."
                                })
                                }
                                className={`form-select ${errors.chapter && 'is-invalid'}`}
                            >
                                <option value="">Select a Chapter</option>
                                {
                                    chapters && chapters.map(chapter => {
                                        return (
                                            <option value={chapter.id}>{chapter.title}</option>
                                        )
                                    })
                                }
                            </select>
                            {errors.chapter && <p className='invalid-feedback'>{errors.chapter.message}</p>}
                        </div>

                        <div className='mb-3'>
                            <label className='form-label'>
                                Lesson
                            </label>
                            <input
                                {...register('lesson', {
                                    required: "The lesson field is required."
                                })}
                                type="text"
                                className={`form-control ${errors.lesson && 'is-invalid'}`}
                                placeholder='Lesson'
                            />
                            {
                                errors.lesson && <p className='invalid-feedback'>{errors.lesson.message}</p>
                            }
                        </div>

                        <div>
                            <label htmlFor="" className='form-label'>
                                Status
                            </label>
                            <select {...register('status', { required: "The status field is required." })} className='form-select' defaultValue="1">
                                <option value="1">Active</option>
                                <option value="0">Block</option>
                            </select>
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            disabled={loading}
                            className='btn btn-primary'
                        >
                            {loading === false ? 'Save' : 'Please wait...'}
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}

export default CreateLesson
