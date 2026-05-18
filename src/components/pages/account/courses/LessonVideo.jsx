import React, { useState, useEffect } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import { toast } from 'react-hot-toast';
import { apiUrl, token } from '../../../common/Config';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

registerPlugin(FilePondPluginFileValidateType);

const LessonVideo = ({ lesson }) => {
    const [files, setFiles] = useState([]);
    const [videoUrl, setVideoUrl] = useState();

    useEffect(() => {
        if (lesson?.video_url) {
            setVideoUrl(lesson.video_url);
        }
    }, [lesson]);

    return (
        <>
            <div className='card shadow-lg border-0 mt-4'>
                <div className='card-body p-4'>
                    <div className="d-flex">
                        <h4 className="h5 mb-3">Lesson Video</h4>
                    </div>

                    <FilePond
                        acceptedFileTypes={['video/mp4']}
                        credits={false}
                        files={files}
                        onupdatefiles={setFiles}
                        allowMultiple={false}
                        maxFiles={1}
                        server={{
                            process: {
                                url: `${apiUrl}/save-lesson-video/${lesson?.id}`,
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${token()}`,
                                    'Accept': 'application/json',
                                },
                                onload: (response) => {
                                    response = JSON.parse(response);
                                    toast.success(response.message);
                                    setVideoUrl(response.data.video);
                                    setTimeout(() => setFiles([]), 100);
                                },
                                onerror: (errors) => {
                                    console.log(errors);
                                    toast.error("Failed to upload video");
                                },
                            },
                        }}
                        name="video"
                        labelIdle='Drag & Drop your video or <span class="filepond--label-action">Browse</span>'
                    />

                    {videoUrl && (
                        <div className='video-container mb-3' style={{
                            position: 'relative',
                            width: '100%',
                            backgroundColor: '#000',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            aspectRatio: '16/9',
                            marginTop: '16px'
                        }}>
                            <video
                                key={videoUrl}
                                src={videoUrl}
                                controls
                                width="100%"
                                height="100%"
                                controlsList="nodownload"
                                onContextMenu={e => e.preventDefault()}
                                style={{ objectFit: 'contain' }}
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default LessonVideo;
