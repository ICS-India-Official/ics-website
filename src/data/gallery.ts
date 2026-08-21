import libraryImg from "@/assets/gallery-library.jpg";
import chapelImg from "@/assets/gallery-chapel.jpg";
import classroomImg from "@/assets/gallery-classroom.jpg";
import convocationImg from "@/assets/gallery-convocation.jpg";
import graduationImg from "@/assets/gallery-graduation.jpg";
import campusImg from "@/assets/gallery-campus.jpg";

export const gallery = [
  { src: libraryImg, label: "Library & Study", span: "sm:col-span-3 sm:row-span-2" },
  { src: chapelImg, label: "Chapel & Worship", span: "sm:col-span-3 sm:row-span-2" },
  { src: classroomImg, label: "Classroom Learning", span: "sm:col-span-3" },
  { src: convocationImg, label: "Convocation Day", span: "sm:col-span-1" },
  { src: graduationImg, label: "Graduation Ceremony", span: "sm:col-span-1" },
  { src: campusImg, label: "Campus Walks", span: "sm:col-span-1" },
];
