import React, { useEffect, useState } from 'react'
import Layout from '../../../common/Layout'
import UserSidebar from '../../../common/UserSidebar'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { apiUrl, token } from '../../../common/Config'
import ManagerOutcome from './ManagerOutcome'
import ManageRequirement from './ManageRequirement'
import EditCover from './EditCover'
import ManageChapter from './ManageChapter'

const EditCourse = () => {
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState({});
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm({
        defaultValues: async () => {
            await fetch(`${apiUrl}/courses/${params.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(result => {
                    if (result.status === 200) {
                        reset({
                            title: result.data.title,
                            category: result.data.category_id,
                            level: result.data.level_id,
                            language: result.data.language_id,
                            description: result.data.description,
                            sellPrice: result.data.sell_price,
                            crossPrice: result.data.cross_price,
                        })
                        setCourse(result.data);
                    } else {
                        console.log("something went wrong")
                    }
                });
        }
    })

    const [categories, setCategories] = useState([])
    const [levels, setLevels] = useState([])
    const [languages, setLanguages] = useState([])

    const onSubmit = async (data) => {
        setLoading(true)
        await fetch(`${apiUrl}/courses/${params.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(result => {
                setLoading(true)
                if (result.status === 200) {
                    toast.success(result.message)
                } else {
                    const errors = result.errors
                    Object.keys(errors).forEach(field => {
                        setError(field, { message: errors[field][0] })
                    })
                }
            });
    }

    const courseMetaData = async () => {
        await fetch(`${apiUrl}/courses/meta-data`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(result => {
                if (result.status === 200) {
                    setCategories(result.categories)
                    setLevels(result.levels)
                    setLanguages(result.languages)
                } else {
                    console.log("something went wrong")
                }
            })
    }

    useEffect(() => {
        courseMetaData()
    }, [])

    return (
        <Layout>
            <section className='section-4'>
                <div className='container pb-5 pt-3'>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/account">Account</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Edit Course</li>
                        </ol>
                    </nav>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <div className='d-flex justify-content-between'>
                                <h2 className='h4 mb-0 pb-0'>Edit Course</h2>
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
                                                    <label className='form-label' htmlFor="title">Title</label>
                                                    <input
                                                        type="text"
                                                        id="title"
                                                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                                        placeholder="Title"
                                                        {...register('title', { required: true })}
                                                    />
                                                    {errors.title && <p className="text-danger">Title is required</p>}
                                                </div>

                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="category">Category</label>
                                                    <select className={`form-select ${errors.category ? 'is-invalid' : ''}`} id='category' {...register('category', { required: true })}>
                                                        <option value="">Select a Category</option>
                                                        {categories && categories.map(category => (
                                                            <option key={category.id} value={category.id}>{category.name}</option>
                                                        ))}
                                                    </select>
                                                    {errors.category && <p className="text-danger">Category is required</p>}
                                                </div>

                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="level">Level</label>
                                                    <select className={`form-select ${errors.level ? 'is-invalid' : ''}`} id='level' {...register('level', { required: true })}>
                                                        <option value="">Select a Level</option>
                                                        {levels && levels.map(level => (
                                                            <option key={level.id} value={level.id}>{level.name}</option>
                                                        ))}
                                                    </select>
                                                    {errors.level && <p className="text-danger">Level is required</p>}
                                                </div>

                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="language">Language</label>
                                                    <select className={`form-select ${errors.language ? 'is-invalid' : ''}`} id='language' {...register('language', { required: true })}>
                                                        <option value="">Select a Language</option>
                                                        {languages && languages.map(lang => (
                                                            <option key={lang.id} value={lang.id}>{lang.name}</option>
                                                        ))}
                                                    </select>
                                                    {errors.language && <p className="text-danger">Language is required</p>}
                                                </div>

                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="description">Description</label>
                                                    <textarea
                                                        id="description"
                                                        rows={5}
                                                        placeholder='Description'
                                                        className='form-control'
                                                        {...register('description')}
                                                    />
                                                </div>

                                                <h4 className="h5 border-bottom pb-3 mb-3">Pricing</h4>

                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="sellPrice">Sell Price</label>
                                                    <input
                                                        type="text"
                                                        id="sellPrice"
                                                        className={`form-control ${errors.sellPrice ? 'is-invalid' : ''}`}
                                                        placeholder="Sell Price"
                                                        {...register('sellPrice', { required: true })}
                                                    />
                                                    {errors.sellPrice && <p className="text-danger">Sell Price is required</p>}
                                                </div>

                                                <div className='mb-3'>
                                                    <label className='form-label' htmlFor="crossPrice">Cross Price</label>
                                                    <input
                                                        type="text"
                                                        id="crossPrice"
                                                        className='form-control'
                                                        placeholder="Cross Price"
                                                        {...register('crossPrice')}
                                                    />
                                                </div>
                                                <button
                                                    disabled={loading}
                                                    className='btn btn-primary'
                                                >
                                                    {loading === false ? 'Update' : 'Please wait...'}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                    <ManageChapter
                                        course={course}
                                        params={params}
                                    />
                                </div>
                                <div className='col-md-5'>
                                    <ManagerOutcome />
                                    <ManageRequirement />
                                    <EditCover
                                        course={course}
                                        setCourse={setCourse}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default EditCourse