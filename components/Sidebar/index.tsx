"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "@/components/Sidebar/SidebarItem";
import ClickOutside from "../ClickOutside";
import useLocalStorage from "@/hooks/useLocalStorage";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const menuGroups = [
  {
    name: "Main",
    menuItems: [
      {
        icon: (
          <svg  height="25" width="25" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#22409a"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g clip-path="url(#fclip0_14_1960)"> <path d="M25.545 8H11C9.34315 8 8 9.34315 8 11V28.931C8 30.5879 9.34315 31.931 11 31.931H25.545C27.2019 31.931 28.545 30.5879 28.545 28.931V11C28.545 9.34315 27.2019 8 25.545 8Z" stroke="#f" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M52.94 8H38.395C36.7382 8 35.395 9.34315 35.395 11V15.272C35.395 16.9289 36.7382 18.272 38.395 18.272H52.94C54.5969 18.272 55.94 16.9289 55.94 15.272V11C55.94 9.34315 54.5969 8 52.94 8Z" stroke="#fcb815" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M52.94 25.121H38.395C36.7382 25.121 35.395 26.4641 35.395 28.121V52.94C35.395 54.5969 36.7382 55.94 38.395 55.94H52.94C54.5969 55.94 55.94 54.5969 55.94 52.94V28.121C55.94 26.4641 54.5969 25.121 52.94 25.121Z" stroke="#f" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M25.545 38.818H11C9.34315 38.818 8 40.1611 8 41.818V52.939C8 54.5958 9.34315 55.939 11 55.939H25.545C27.2019 55.939 28.545 54.5958 28.545 52.939V41.818C28.545 40.1611 27.2019 38.818 25.545 38.818Z" stroke="#fcb815" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path> </g> <defs> <clipPath id="clip0_14_1960"> <rect width="51.94" height="51.939" fill="white" transform="translate(6 6)"></rect> </clipPath> </defs> </g></svg>
        ),
        label: "Dashboard",
        route: "/smartcampus/dashboard",
      },
      {
        icon: (
          <svg  height="25" width="25" fill="#22409a" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M19,4H17V3a1,1,0,0,0-2,0V4H9V3A1,1,0,0,0,7,3V4H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A3,3,0,0,0,19,4Zm1,15a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V12H20Zm0-9H4V7A1,1,0,0,1,5,6H7V7A1,1,0,0,0,9,7V6h6V7a1,1,0,0,0,2,0V6h2a1,1,0,0,1,1,1Z"></path></g></svg>
        ),
        label: "Events calender",
        route: "/smartcampus/calender",
      },
      {
        icon: (
          <svg  height="25" width="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" d="M12 2C7.58172 2 4 6.00258 4 10.5C4 14.9622 6.55332 19.8124 10.5371 21.6744C11.4657 22.1085 12.5343 22.1085 13.4629 21.6744C17.4467 19.8124 20 14.9622 20 10.5C20 6.00258 16.4183 2 12 2Z" fill="#22409a"></path> <path d="M12 12.5C13.3807 12.5 14.5 11.3807 14.5 10C14.5 8.61929 13.3807 7.5 12 7.5C10.6193 7.5 9.5 8.61929 9.5 10C9.5 11.3807 10.6193 12.5 12 12.5Z" fill="#22409a"></path> </g></svg>
        ),
        label: "Campus Map",
        route: "/smartcampus/campus-map",
      },
    ],
  },
  {
    name: "Academic",
    menuItems: [
      {
        icon: (
          <svg  height="25" width="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.2172 3.49965C12.7962 2.83345 11.2037 2.83345 9.78272 3.49965L3.0916 6.63659C2.0156 7.14105 1.73507 8.56352 2.25 9.54666L2.25 14.5C2.25 14.9142 2.58579 15.25 3 15.25C3.41421 15.25 3.75 14.9142 3.75 14.5V10.672L9.78281 13.5003C11.2038 14.1665 12.7963 14.1665 14.2173 13.5003L20.9084 10.3634C22.3639 9.68105 22.3639 7.31899 20.9084 6.63664L14.2172 3.49965Z" fill="#22409a"></path> <path opacity="0.5" d="M5 11.2581L9.78281 13.5003C11.2038 14.1665 12.7963 14.1665 14.2173 13.5003L19 11.2581V16.6252C19 17.6333 18.4965 18.577 17.6147 19.0654C16.1463 19.8786 13.796 20.9998 12 20.9998C10.204 20.9998 7.8537 19.8786 6.38533 19.0654C5.5035 18.577 5 17.6333 5 16.6252V11.2581Z" fill="#22409a"></path> </g></svg>
        ),
        label: "Course Management",
        route: "/smartcampus/course-management",
      },
      {
        icon: (
         <svg  height="25" width="25" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>schedule_line</title> <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Business" transform="translate(-864.000000, 0.000000)" fill-rule="nonzero"> <g id="schedule_line" transform="translate(864.000000, 0.000000)"> <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" id="MingCute" fill-rule="nonzero"> </path> <path d="M16,3 C16.5523,3 17,3.44772 17,4 L17,4 L17,5 L19,5 C20.1046,5 21,5.89543 21,7 L21,7 L21,19 C21,20.1046 20.1046,21 19,21 L19,21 L5,21 C3.89543,21 3,20.1046 3,19 L3,19 L3,7 C3,5.89543 3.89543,5 5,5 L5,5 L7,5 L7,4 C7,3.44772 7.44771,3 8,3 C8.55229,3 9,3.44772 9,4 L9,4 L9,5 L15,5 L15,4 C15,3.44772 15.4477,3 16,3 Z M19,7 L5,7 L5,19 L19,19 L19,7 Z M14.8241,9.37872 C15.2146,8.9882 15.8478,8.9882 16.2383,9.37872 C16.6289,9.76924 16.6289,10.4024 16.2383,10.7929 L16.2383,10.7929 L11.2957,15.7356 C10.9012,16.13 10.2617,16.13 9.86731,15.7356 L9.86731,15.7356 L7.75306,13.6214 C7.36253,13.2308 7.36253,12.5977 7.75306,12.2071 C8.14358,11.8166 8.77675,11.8166 9.16727,12.2071 L9.16727,12.2071 L10.5815,13.6214 Z" id="形状结合" fill="#22409a"> </path> </g> </g> </g> </g></svg>
        ),
        label: "Class Schedule",
        route: "/smartcampus/class-schedule",
      },
      {
        icon: (
          <svg  height="25" width="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" mirror-in-rtl="true" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#22409a" d="M7 11c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2s2 .9 2 2v1c0 1.1-.9 2-2 2zm-2 6.993L9 18c.55 0 1-.45 1-1v-2c0-1.65-1.35-3-3-3s-3 1.35-3 3v2c0 .552.448.993 1 .993zM19 18h-6c-.553 0-1-.447-1-1s.447-1 1-1h6c.553 0 1 .447 1 1s-.447 1-1 1zm0-4h-6c-.553 0-1-.448-1-1s.447-1 1-1h6c.553 0 1 .448 1 1s-.447 1-1 1zm0-4h-6c-.553 0-1-.448-1-1s.447-1 1-1h6c.553 0 1 .448 1 1s-.447 1-1 1z"></path> <path fill="#22409a" d="M22 2H2C.9 2 0 2.9 0 4v16c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 17.5c0 .28-.22.5-.5.5h-19c-.28 0-.5-.22-.5-.5v-15c0-.28.22-.5.5-.5h19c.28 0 .5.22.5.5v15z"></path> </g></svg>
        ),
        label: "Attendance",
        route: "/smartcampus/attendance",
      },
      {
        icon: (
          <svg  height="25" width="25" fill="#22409a" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M20.667 1.333a2.666 2.666 0 0 0-2.666 2.666v4.334L11.334 8V3.333a3.333 3.333 0 0 0-6.667 0v17.334C4.667 22.51 6.158 24 8 24s3.334-1.491 3.334-3.333v-5.334h6.667v5.334a2.666 2.666 0 1 0 5.332 0V4a2.666 2.666 0 0 0-2.666-2.666M4 3.333c0-.538.108-1.051.302-1.52a3.319 3.319 0 0 0-1.635 2.853v15.335c0 1.432.908 2.643 2.178 3.114A3.972 3.972 0 0 1 4 20.668zm-1.698-.187A3.32 3.32 0 0 0 .667 5.999v12.668c0 1.218.66 2.272 1.635 2.853A3.966 3.966 0 0 1 2 20V4.666c0-.538.108-1.05.302-1.52M17.334 4c0-.698.217-1.344.584-1.88a2.659 2.659 0 0 0-1.917 2.546v2.9l1.333.067zm0 12H16v4c0 1.211.812 2.222 1.917 2.547a3.315 3.315 0 0 1-.584-1.88zM14 19.333c0 1.211.813 2.222 1.92 2.547a3.304 3.304 0 0 1-.587-1.88v-4H14zm1.334-14.667c0-.697.217-1.344.584-1.88a2.659 2.659 0 0 0-1.917 2.547v2.133l1.333.067z"></path></g></svg>
        ),
        label: "Hall Booking",
        route: "/smartcampus/bookings",
      },
    ],
  },
  {
    name: "Administrative",
    menuItems: [
      {
        icon: (
          <svg  height="25" width="25" viewBox="0 -0.05 20.109 20.109" xmlns="http://www.w3.org/2000/svg" fill="#22409a"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="edit-user-2" transform="translate(-2 -2)"> <circle id="secondary" fill="#fcb815" cx="5" cy="5" r="5" transform="translate(6 3)"></circle> <path id="primary" d="M9,21H4a1,1,0,0,1-1-1,7,7,0,0,1,7-7h1" fill="none" stroke="#22409a" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path> <path id="primary-2" data-name="primary" d="M20.71,16.09,15.8,21H13V18.2l4.91-4.91a1,1,0,0,1,1.4,0l1.4,1.4A1,1,0,0,1,20.71,16.09ZM11,3a5,5,0,1,0,5,5A5,5,0,0,0,11,3Z" fill="none" stroke="#22409a" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path> </g> </g></svg>
        ),
        label: "User Management",
        route: "/smartcampus/user-management",
      },
      {
        icon: (
          <svg  height="25" width="25" fill="#22409a" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M22,21H21V14a3,3,0,0,0-3-3H14.172V8.945a4.987,4.987,0,0,0,6.363-.581,1,1,0,0,0,0-1.414L14.879,1.293a1,1,0,0,0-1.414,0A4.968,4.968,0,0,0,12,4.828a4.985,4.985,0,0,0,.172,1.234V11H8V8.816a3,3,0,1,0-2,0V11a3,3,0,0,0-3,3v7H2a1,1,0,0,0,0,2H22a1,1,0,0,0,0-2ZM14.292,3.534l4,4a3.066,3.066,0,0,1-3.415-.587,3.005,3.005,0,0,1-.587-3.416ZM7,5A1,1,0,1,1,6,6,1,1,0,0,1,7,5Zm5,16H9V19a1.5,1.5,0,0,1,3,0Zm7-6H16a1,1,0,0,0,0,2h3v4H14V19a3.5,3.5,0,0,0-7,0v2H5V14a1,1,0,0,1,1-1H18a1,1,0,0,1,1,1Z"></path></g></svg>
        ),
        label: "Facility Booking",
        route: "/smartcampus/facilities",
      },
      {
        icon: (
         <svg  height="25" width="25" fill="#22409a" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 496 496" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M468.416,208c-2.176-12.024-5.376-23.928-9.544-35.56l23.904-13.8l-40-69.28l-23.944,13.824 c-7.944-9.352-16.656-18.064-26.008-26.008l13.824-23.944l-69.28-40l-13.8,23.904c-11.64-4.176-23.544-7.368-35.568-9.552V0h-80 v27.584c-12.024,2.176-23.928,5.376-35.56,9.544l-13.8-23.904l-69.28,40l13.824,23.944c-9.352,7.944-18.064,16.656-26.008,26.008 L53.224,89.36l-40,69.28l23.904,13.8c-4.168,11.632-7.36,23.536-9.544,35.56H0v80h27.584c2.176,12.024,5.376,23.928,9.544,35.56 l-23.904,13.8l40,69.28l23.944-13.824c7.944,9.352,16.656,18.064,26.008,26.008l-13.824,23.944l69.28,40l13.8-23.904 c11.632,4.168,23.536,7.368,35.56,9.544V496h80v-27.584c12.024-2.176,23.928-5.376,35.56-9.544l13.8,23.904l69.28-40 l-13.824-23.944c9.352-7.944,18.064-16.656,26.008-26.008l23.944,13.824l40-69.28l-23.904-13.8 c4.168-11.632,7.368-23.536,9.544-35.56H496V288v-80H468.416z M480,272h-25.272l-1.016,6.832 c-2.28,15.384-6.376,30.632-12.168,45.336l-2.52,6.416l21.888,12.632l-24,41.56l-21.92-12.648l-4.296,5.384 c-9.768,12.248-20.928,23.416-33.176,33.176l-5.384,4.296l12.648,21.92l-41.56,24l-12.64-21.888l-6.416,2.52 c-14.704,5.792-29.952,9.88-45.336,12.168L272,454.728V480h-48v-25.272l-6.832-1.016c-15.384-2.28-30.632-6.376-45.336-12.168 l-6.416-2.52l-12.64,21.888l-41.56-24l12.648-21.92l-5.384-4.296c-12.248-9.768-23.416-20.928-33.176-33.176l-4.296-5.384 l-21.92,12.648l-24-41.56l21.888-12.64l-2.52-6.416c-5.792-14.704-9.88-29.952-12.168-45.336L41.272,272H16v-48h25.272 l1.016-6.832c2.28-15.384,6.376-30.632,12.168-45.336l2.52-6.416l-21.888-12.64l24-41.56l21.92,12.648l4.296-5.384 c9.768-12.248,20.928-23.416,33.176-33.176l5.384-4.296l-12.648-21.92l41.56-24l12.64,21.888l6.416-2.52 c14.704-5.792,29.952-9.88,45.336-12.168L224,41.272V16h48v25.272l6.832,1.016c15.384,2.28,30.632,6.376,45.336,12.168 l6.416,2.52l12.64-21.888l41.56,24l-12.648,21.92l5.384,4.296c12.248,9.768,23.416,20.928,33.176,33.176l4.296,5.384 l21.92-12.648l24,41.56l-21.888,12.64l2.52,6.416c5.792,14.704,9.88,29.952,12.168,45.336l1.016,6.832H480V272z"></path> <rect x="240" y="368" width="16" height="16"></rect> <rect x="240" y="432" width="16" height="16"></rect> <path d="M96,170.808V341.2l144,64.008V416h16v-10.8l144-64.008V170.808l-152-67.56L96,170.808z M296,248 c0,15.64-7.696,30.36-20.576,39.368L272,289.752V304h-16v-33.472c9.288-3.312,16-12.112,16-22.528c0-13.232-10.768-24-24-24 s-24,10.768-24,24c0,10.416,6.712,19.216,16,22.528V304h-16v-14.248l-3.424-2.384C207.696,278.36,200,263.64,200,248 c0-26.472,21.528-48,48-48S296,221.528,296,248z M272,320v16h-48v-16H272z M240,248c0-4.416,3.584-8,8-8s8,3.584,8,8 s-3.584,8-8,8C243.584,256,240,252.416,240,248z M240,124.312v60.24c-17.224,2.16-32.312,11.184-42.488,24.248L123.696,176 L240,124.312z M384,330.808L248,391.24L112,330.8V188.312l77.256,34.336C185.888,230.432,184,239,184,248 c0,19.448,8.896,37.8,24,49.92V304h-16v16h16v32h80v-32h16v-16h-16v-6.08c15.104-12.128,24-30.48,24-49.92 c0-9-1.888-17.568-5.256-25.352L384,188.312V330.808z M256,124.312L372.304,176l-73.816,32.808 c-10.176-13.072-25.264-22.088-42.488-24.256V124.312z"></path> </g> </g> </g> </g></svg>
        ),
        label: "Facility Management",
        route: "/smartcampus/facility-management",
      },
      {
        icon: (
          <svg  height="25" width="25" fill="#22409a" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>report</title> <path d="M6 11h4v17h-4v-17zM22 16v12h4v-12h-4zM14 28h4v-24h-4v24z"></path> </g></svg>
        ),
        label: "Reports",
        route: "/smartcampus/reports",
      },
    ],
  },

  {
    name: "Health & Safety",
    menuItems: [
      {
        icon: (
          <svg  height="25" width="25" fill="#22409a" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="a"></g> <g id="b"> <path d="M53,32.2817c.0049-1.5132-.625-2.4961-1.3545-3.6343-.8848-1.3809-1.9863-3.0991-2.3789-6.5732-.7656-6.8198,1.7891-10.3711,1.8145-10.4062,.0918-.1235,.1211-.2832,.0801-.4316-.042-.1484-.1484-.27-.291-.3286-12.5215-5.1592-25.2188-5.1592-37.7402,0-.1426,.0591-.25,.1802-.291,.3291-.042,.1484-.0117,.3076,.0801,.4316,.0264,.0347,2.5732,3.5508,1.8037,10.4053-.3926,3.4746-1.4932,5.1934-2.3779,6.5742-.7295,1.1377-1.3594,2.1206-1.3545,3.6338,.0098,3.2197,0,24.2178,0,24.2183,0,.1323,.0527,.2598,.1465,.3535s.2207,.1465,.3535,.1465H52.5c.1328,0,.2598-.0527,.3535-.1465s.1465-.2212,.1465-.3535c0-.0005-.0098-20.9985,0-24.2183Zm-21.5,3.7183H13v8H31.5v12H11.9902c.001-1.6052,.0032-6.8242,.004-12h.0057v-8h-.006c-.0006-1.7396-.0018-3.0814-.0037-3.7212-.0039-1.2188,.499-2.0044,1.1963-3.0913,.9404-1.4683,2.1113-3.2954,2.5303-7.002,.6465-5.7676-.9287-9.2993-1.6553-10.5767,1.98-.7911,3.9647-1.4381,5.9519-1.9661,2.5359,11.5991,9.8378,15.5259,11.4866,16.2747v10.0826ZM22.4222,14.0616c-.1262-.3107-.2538-.618-.3721-.9448,6.6056-1.4431,13.2942-1.4431,19.8998,0-.1183,.3268-.246,.6342-.3721,.9448-6.3589-1.366-12.7966-1.366-19.1555,0Zm29.5778,20.9384v11h-.0037c.001,4.4637,.0028,8.6022,.0037,10h-19.5v-12h18.5v-8h-18.5v-10.0826c1.6487-.7488,8.9507-4.6755,11.4866-16.2746,1.9869,.528,3.9713,1.175,5.9509,1.9661-.7295,1.2773-2.3115,4.8096-1.665,10.5771,.4199,3.7056,1.5908,5.5327,2.5312,7.001,.6963,1.0874,1.2002,1.873,1.1963,3.0918-.0016,.5103-.0026,1.4721-.0033,2.7212h.0033Z"></path> </g> </g></svg>
        ),
        label: "Safety Monitoring",
        route: "/smartcampus/safety-monitoring",
      },
      {
        icon: (
          <svg  height="25" width="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#22409a"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>resolved_incident</title> <path d="M15,4a8,8,0,1,0,8,8A8,8,0,0,0,15,4Zm0,14a6,6,0,1,1,6-6A6,6,0,0,1,15,18Z"></path> <path d="M0,0H24V24H0Z" fill="none"></path> <path d="M3,12A6,6,0,0,1,7,6.35V4.26A8,8,0,0,0,7,19.74V17.65A6,6,0,0,1,3,12Z"></path> <g> <path d="M17.67,13V10.67A2.66,2.66,0,0,0,16,8.2V8a1,1,0,0,0-2,0v.2a2.66,2.66,0,0,0-1.67,2.47V13L11,14v1h8V14Z"></path> <path d="M15,17a1,1,0,0,0,1-1H14A1,1,0,0,0,15,17Z"></path> </g> </g></svg>
        ),
        label: "Incident Reporting",
        route: "/smartcampus/incident-reporting",
      },
    ],
  },
  {
    name: "System",
    menuItems: [
      {
        icon: (
          <svg  height="25" width="25" viewBox="0 0 1024 1024" className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#22409a"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M772.672 575.808V448.192l70.848-70.848a370.688 370.688 0 0 0-56.512-97.664l-96.64 25.92-110.528-63.808-25.92-96.768a374.72 374.72 0 0 0-112.832 0l-25.92 96.768-110.528 63.808-96.64-25.92c-23.68 29.44-42.816 62.4-56.576 97.664l70.848 70.848v127.616l-70.848 70.848c13.76 35.264 32.832 68.16 56.576 97.664l96.64-25.92 110.528 63.808 25.92 96.768a374.72 374.72 0 0 0 112.832 0l25.92-96.768 110.528-63.808 96.64 25.92c23.68-29.44 42.816-62.4 56.512-97.664l-70.848-70.848z m39.744 254.848l-111.232-29.824-55.424 32-29.824 111.36c-37.76 10.24-77.44 15.808-118.4 15.808-41.024 0-80.768-5.504-118.464-15.808l-29.888-111.36-55.424-32-111.168 29.824A447.552 447.552 0 0 1 64 625.472L145.472 544v-64L64 398.528A447.552 447.552 0 0 1 182.592 193.28l111.168 29.824 55.424-32 29.888-111.36A448.512 448.512 0 0 1 497.472 64c41.024 0 80.768 5.504 118.464 15.808l29.824 111.36 55.424 32 111.232-29.824c56.32 55.68 97.92 126.144 118.592 205.184L849.472 480v64l81.536 81.472a447.552 447.552 0 0 1-118.592 205.184zM497.536 627.2a115.2 115.2 0 1 0 0-230.4 115.2 115.2 0 0 0 0 230.4z m0 76.8a192 192 0 1 1 0-384 192 192 0 0 1 0 384z" fill="#22409a"></path></g></svg>
        ),
        label: "System Settings",
        route: "/smartcampus/system-settings",
      },
    ],
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        id="sidebar"
        className={`z-9999999 w-72.5 fixed left-0 top-0 flex h-screen flex-col overflow-y-hidden bg-light duration-300 ease-linear dark:bg-boxdark lg:relative lg:translate-x-0 ${
          sidebarOpen ? " translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <Link href="/" className="rounded">
            <Image
              width={176}
              height={32}
              src={"/images/logo/logo.png"}
              alt="Logo"
              priority
            />
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
            aria-label="Toggle sidebar"
          >
            <svg
              className="fill-current"
              width="20"
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
                fill=""
              />
            </svg>
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="text-bodydark2 mb-4 ml-4 text-sm font-semibold">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
