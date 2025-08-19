import { styled } from "@mui/material";
import { Link as LinkComponent } from "react-router-dom";
import { grayColor } from "../../constants/Color";

export const VisuallyHidden = styled("input")({
    border:"0",
    clip: "rect(0 0 0 0)",
    height: "1px",
    margin: "-1px",
    overflow: "hidden",
    padding: "0",
    position: "absolute",
    whiteSpace: "nowrap",
    width: "1px",
});

export const Link= styled(LinkComponent)`
    text-decoration: none;
    color: inherit;
    &:hover {
        background-color: #f0f0f0;
    }
`;

export const InputBox = styled("input")`
    width: 100%;
    height: 100%;
    border:none;
    outline: none;
    padding: 0 3rem;
    border-radius: 1.5rem;
    background-color: ${grayColor};
`

export const SearchField = styled("input")`
    padding: 1rem 2rem;
    width: 20vmax;
    border:none;
    outline:none;
    border-radius:1.5rem;
    background-color: ${grayColor};
    font-size: 1.1rem;
`;

export const CurveButton = styled("button")`
    border-radius:1.5rem;
    padding: 1rem 2rem;
    border:none;
    outline:none;
    cursor:pointer;
    background-color:black;
    color:white;
    font-size: 1.1rem;
    &:hover{
        background-color: rgba(0,0,0,0.8);
    }  
`