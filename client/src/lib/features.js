import moment from "moment";

const fileFormat = (url = "") => {
    const fileExt = url.split('.').pop().toLowerCase();

    if(fileExt === "mp4" || fileExt === "webm" || fileExt === "ogg") return "video";

    if(fileExt === "mp3" || fileExt === "wav") return "audio";

    if(fileExt === "jpg" || fileExt === "jpeg" || fileExt === "png" || fileExt === "gif") return "image";


    return "file";
}

const transformImage = (url="", witdh=100) => url;

const getLast12Day = () => {
    const currentDate = moment();

    const last12days = [];
    for(let i=0;i<11;i++){
        const dayDate = currentDate.clone().subtract(i,"days");
        const dayName = dayDate.format("ddd");

        last12days.unshift(dayName);
    }
    return last12days;
}

export {fileFormat, transformImage, getLast12Day};