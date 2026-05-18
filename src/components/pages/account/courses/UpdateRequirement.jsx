import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiUrl, token } from '../../../common/Config';

const UpdateRequirement = ({ requirementsData, showRequirement, handleClose, requirements, setRequirements }) => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = async (data) => {
        setLoading(true)
        await fetch(`${apiUrl}/requirements/${requirementsData.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token()}`
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(result => {
                setLoading(false)
                if (result.status === 200) {
                    const updateRequirements = requirements.map(requirement =>
                        requirement.id == result.data.id
                            ? { ...requirement, requirement: result.data.requirement }
                            : requirement
                    )
                    setRequirements(updateRequirements)
                    toast.success(result.message)
                } else {
                    console.log("something went wrong")
                }
            });
    }

    useEffect(() => {
        if (requirementsData) {
            reset({
                requirement: requirementsData.requirement
            })
        }
    }, [requirementsData]);

    return (
        <>
            <Modal size='lg' show={showRequirement} onHide={handleClose}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Requirement</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='mb-3'>
                            <label htmlFor="" className='form-label'>
                                Requirement
                            </label>
                            <input
                                {
                                ...register('requirement', {
                                    required: "The requirement field is required."
                                })
                                }
                                type="text"
                                className={`form-control ${errors.requirement && 'is-invalid'}`}
                                placeholder='Requirement'
                            />
                            {
                                errors.requirement && <p className='invalid-feedback'>{errors.requirement.message}</p>
                            }
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            disabled={loading}
                            className='btn btn-primary mb-3'
                        >
                            {loading === false ? 'Save' : 'Please wait...'}
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}

export default UpdateRequirement
