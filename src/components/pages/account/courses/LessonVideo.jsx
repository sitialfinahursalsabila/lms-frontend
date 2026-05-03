import React, { useState, useEffect } from 'react'; // ✅ tambah useEffect
import { FilePond, registerPlugin } from 'react-filepond';
import { toast } from 'react-hot-toast';
import { apiUrl, token } from '../../../common/Config';
import 'filepond/dist/filepond.min.css';
import ReactPlayer from 'react-player';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

registerPlugin(FilePondPluginFileValidateType);

const LessonVideo = ({ lesson }) => {
    const [files, setFiles] = useState([]);
    const [videoUrl, setVideoUrl] = useState();

    useEffect(() => {
        if (lesson) {
            setVideoUrl(lesson.video_url) // ✅ set video saat lesson load
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
                                    'Authorization': `Bearer ${token}`,
                                    'Accept': 'application/json',
                                },
                                onload: (response) => {
                                    response = JSON.parse(response);
                                    toast.success(response.message);
                                    setVideoUrl(response.data.video)
                                    setFiles([]);
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
                    {videoUrl &&
                        <ReactPlayer
                            width="100%"
                            height="100%"
                            controls
                            url={videoUrl} />
                    }
                </div>
            </div>
        </>
    );
};

export default LessonVideo;