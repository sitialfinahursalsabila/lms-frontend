import Layout from '../../common/Layout'
import { Accordion, ProgressBar } from 'react-bootstrap';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdSlowMotionVideo } from "react-icons/md";
import { Link, useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import toast from 'react-hot-toast';
import { apiUrl, token } from '../../common/Config';


const WatchCourse = () => {
    const [course, setCourse] = useState();
    const [activeLesson, setActiveLesson] = useState(null);
    const [completedLessons, setCompletedLessons] = useState([]);
    const [progress, setProgress] = useState(0);
    const params = useParams();

    const fetchCourse = async () => {
        await fetch(`${apiUrl}/enroll/${params.id}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token()}`,
            },
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.status == 200) {
                    setCourse(result.data);
                    setActiveLesson(result.activeLesson);
                    setCompletedLessons(result.completedLessons)
                    setProgress(result.progress)
                } else {
                    console.log("Something went wrong")
                }
            })
    }

    const showLesson = async (lesson) => {
        setActiveLesson(lesson)
        const data = {
            lesson_id: lesson.id,
            chapter_id: lesson.chapter_id,
            course_id: params.id,
        }

        await fetch(`${apiUrl}/save-activity`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token()}`,
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.status == 200) {
                    // Logika sukses (seperti setCourse)
                } else {
                    console.log("Something went wrong")
                }
            })
    }

    const markAsComplete = async (activeLesson) => {
        const data = {
            lesson_id: activeLesson.id,
            chapter_id: activeLesson.chapter_id,
            course_id: params.id,
        }

        await fetch(`${apiUrl}/mark-as-complete`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token()}`,
            },
            body: JSON.stringify(data)
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.status == 200) {
                    toast.success(result.message);
                    setCompletedLessons(result.completedLessons)
                    setProgress(result.progress)
                } else {
                    console.log("Something went wrong")
                }
            })
    }


    useEffect(() => {
        fetchCourse();
    }, [])

    return (
        <Layout>
            {course &&
                <section className='section-5'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-md-8'>
                                {
                                    activeLesson && activeLesson &&
                                    <>
                                        <div className='video-container mb-3' style={{
                                            position: 'relative',
                                            width: '100%',
                                            backgroundColor: '#000',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            aspectRatio: '16/9'
                                        }}>
                                            {activeLesson?.video_url ? (
                                                <video
                                                    key={activeLesson.id}
                                                    controls
                                                    width="100%"
                                                    height="100%"
                                                    controlsList="nodownload"
                                                    onContextMenu={e => e.preventDefault()}
                                                    style={{ objectFit: 'contain' }} // Memastikan video tidak terpotong
                                                >
                                                    <source src={activeLesson.video_url} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            ) : (
                                                <div className="d-flex align-items-center justify-content-center h-100 text-white">
                                                    <p>Memuat video...</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className='meta-content'>
                                            <div className='d-flex justify-content-between align-items-center border-bottom pb-2 mb-3 pt-1'>
                                                <h3 className='pt-2'>{activeLesson?.title}</h3>
                                                <div>
                                                    <Link
                                                        onClick={() => markAsComplete(activeLesson)}
                                                        className={`${completedLessons && completedLessons.includes(activeLesson.id) ? 'disabled' : ''} btn btn-primary px-3`}
                                                    >
                                                        Mark as complete <IoMdCheckmarkCircleOutline size={20} />
                                                    </Link>
                                                </div>
                                            </div>
                                            <div dangerouslySetInnerHTML={{ __html: activeLesson.description }}>
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>
                            <div className='col-md-4'>
                                <div className='card rounded-0'>
                                    <div className='card-body'>
                                        <div className='h6'>
                                            <strong>{course?.title}</strong>
                                        </div>
                                        <div className='py-2'>
                                            <ProgressBar now={progress} />
                                            <div className='pt-2'>
                                                {progress}% complete
                                            </div>
                                        </div>
                                        <Accordion flush>
                                            {
                                                course && course.chapters.map(chapter => {
                                                    return (

                                                        <Accordion.Item eventKey={chapter.id} key={chapter.id}>
                                                            <Accordion.Header>{chapter.title}</Accordion.Header>
                                                            <Accordion.Body className='pt-2 pb-0 ps-0'>
                                                                <ul className='lessons mb-0'>
                                                                    {
                                                                        chapter.lessons && chapter.lessons.map(lesson => {
                                                                            return (
                                                                                <li className='pb-2' key={lesson.id}>
                                                                                    <Link
                                                                                        className={`${completedLessons && completedLessons.includes(lesson.id) ? 'disabled' : 'text-success'}`}
                                                                                        onClick={() => showLesson(lesson)}
                                                                                    >
                                                                                        <MdSlowMotionVideo size={20} /> {lesson.title}
                                                                                    </Link>
                                                                                </li>
                                                                            )
                                                                        })
                                                                    }
                                                                </ul>
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    )
                                                })
                                            }
                                        </Accordion>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            }
        </Layout >
    );
};

export default WatchCourse;
