import React, { useEffect, useState, useRef, useMemo } from 'react';
import Layout from '../../../common/Layout';
import UserSidebar from '../../../common/UserSidebar';
import { useForm } from 'react-hook-form';
import { apiUrl, token } from '../../../common/Config';
import { useParams, Link } from 'react-router-dom'; //
import JoditEditor from 'jodit-react';
import toast from 'react-hot-toast';
import LessonVideo from './LessonVideo';

const EditLesson = ({ placeholder }) => {
    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm();
    const [chapters, setChapters] = useState([]);
    const [lesson, setLesson] = useState();
    const [loading, setLoading] = useState(false);
    const params = useParams();

    const editor = useRef(null);
    const [content, setContent] = useState('');

    const config = useMemo(() => ({
        readonly: false,
        placeholder: placeholder || 'Start typing...'
    }), [placeholder]);

    const onSubmit = async (data) => {
        setLoading(true);
        data.description = content;

        fetch(`${apiUrl}/lessons/${params.id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token()}`
            },
            body: JSON.stringify({
                chapter: data.chapter,
                lesson: data.lesson,
                duration: data.duration,
                description: data.description,
                free_preview: data.free_preview ?? false,
                status: data.status ?? 1
            })
        })
            .then(res => res.json())
            .then(result => {
                setLoading(false);
                if (result.status === 200) {
                    toast.success(result.message || "Lesson updated successfully");
                } else if (result.errors) {
                    Object.keys(result.errors).forEach(key => {
                        setError(key, { message: result.errors[key][0] });
                    });
                } else {
                    console.log("Something went wrong", result);
                }
            })
            .catch(err => {
                setLoading(false);
                console.error("Submit error:", err);
            });
    };

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const res = await fetch(`${apiUrl}/chapters?course_id=${params.courseId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token()}`
                    }
                });
                const result = await res.json();
                if (result.status === 200) {
                    setChapters(result.data);
                }
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };

        fetch(`${apiUrl}/lessons/${params.id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token()}`
            }
        })
            .then(res => res.json())
            .then(result => {
                if (result.status == 200) {
                    setLesson(result.data);
                    reset({
                        lesson: result.data.title,
                        chapter: result.data.chapter_id,
                        status: result.data.status,
                        duration: result.data.duration,
                        free_preview: result.data.is_free_preview === 'yes'
                    });
                    setContent(result.data.description ?? '');
                } else {
                    console.log("Something went wrong");
                }
            });

        fetchChapters();
    }, [params.courseId]);

    return (
        <>
            <Layout>
                <section className='section-4'>
                    <div className='container pb-5 pt-3'>
                        <div className='row'>
                            <div className='col-md-12 mt-5 mb-3'>
                                <div className='d-flex justify-content-between'>
                                    <h2 className='h4 mb-0 pb-0'>Edit Lesson</h2>
                                    <Link className='btn btn-primary' to={`/account/courses/edit/${params.courseId}`}>Back</Link>
                                </div>
                            </div>
                            <div className='col-lg-3 account-sidebar'>
                                <UserSidebar />
                            </div>
                            <div className='col-lg-9'>
                                <div className='row'>
                                    <div className='col-md-7'>
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <div className='card border-0 shadow-lg'>
                                                <div className='card-body p-4'>
                                                    <h4 className="h5 border-bottom pb-3 mb-3">Course Details</h4>

                                                    <div className='mb-3'>
                                                        <label className='form-label'>Title</label>
                                                        <input
                                                            type="text"
                                                            className={`form-control ${errors.lesson && 'is-invalid'}`}
                                                            placeholder='Title'
                                                            {...register('lesson', { required: 'Lesson is required' })}
                                                        />
                                                        {errors.lesson && <p className='invalid-feedback'>{errors.lesson.message}</p>}
                                                    </div>

                                                    <div className='mb-3'>
                                                        <label className='form-label'>Chapter</label>
                                                        <select
                                                            className={`form-select ${errors.chapter && 'is-invalid'}`}
                                                            {...register('chapter', { required: 'Please select a chapter' })}
                                                        >
                                                            <option value="">Select a Chapter</option>
                                                            {chapters && chapters.map(chapter => (
                                                                <option key={chapter.id} value={chapter.id}>
                                                                    {chapter.title}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {errors.chapter && <p className='invalid-feedback'>{errors.chapter.message}</p>}
                                                    </div>

                                                    <div className='mb-3'>
                                                        <label className='form-label'>Duration(Mins)</label>
                                                        <input
                                                            type="number"
                                                            className={`form-control ${errors.duration && 'is-invalid'}`}
                                                            placeholder='Duration'
                                                            {...register('duration', {
                                                                required: "The duration field is required.",
                                                                valueAsNumber: true
                                                            })}
                                                        />
                                                        {errors.duration && <p className='invalid-feedback'>{errors.duration.message}</p>}
                                                    </div>

                                                    <div className='mb-3'>
                                                        <label className='form-label'>Description</label>
                                                        <div className='mb-3'>
                                                            <JoditEditor
                                                                ref={editor}
                                                                value={content}
                                                                config={config}
                                                                tabIndex={1}
                                                                onBlur={newContent => setContent(newContent)}
                                                                onChange={newContent => { }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className='mb-3'>
                                                        <label className='form-label'>Status</label>
                                                        <select
                                                            className={`form-select ${errors.status && 'is-invalid'}`}
                                                            {...register('status', { required: "The status field is required." })}
                                                        >
                                                            <option value="1">Active</option>
                                                            <option value="0">Block</option>
                                                        </select>
                                                        {errors.status && <p className='invalid-feedback'>{errors.status.message}</p>}
                                                    </div>

                                                    <div className="d-flex mt-3">
                                                        <input
                                                            className="form-check-input"
                                                            {...register('free_preview')}
                                                            type="checkbox"
                                                            id='freeLesson'
                                                        />
                                                        <label className="form-check-label ms-2" htmlFor="freeLesson">Free Lesson</label>
                                                    </div>

                                                    <button
                                                        disabled={loading}
                                                        type="submit"
                                                        className="btn btn-primary mt-3"
                                                    >
                                                        {loading ? 'Please wait...' : 'Save'}
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className='col-md-3'>
                                        <LessonVideo lesson={lesson} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    );
};

export default EditLesson;
