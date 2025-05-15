"use client"
import React, { useContext, useRef, useState } from "react";

const ProjectContext = React.createContext()
const UpdateProject = React.createContext()
export function useProject(){
    return useContext(ProjectContext)
}

export function updateProject(){
    return useContext(UpdateProject)
}
export function ProjectProvider({children}){
    const currentProject = useRef(null);

    function setProjects(projectId){
        currentProject.current = projectId
    }

    
    return (
        <ProjectContext.Provider value={currentProject}>
            <UpdateProject.Provider value={setProjects}>
                {children}
            </UpdateProject.Provider>
        </ProjectContext.Provider>
    )

}