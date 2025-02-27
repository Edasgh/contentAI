"use client";
import {useFormStatus} from "react-dom"
import { Button } from "./ui/button";

const AnalyseButton = () => {
    const {pending} = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="cursor-pointer bg-blue-600 dark:bg-blue-400 hover:bg-blue-500 dark:hover:bg-blue-300"
      suppressHydrationWarning
    >
      {pending ? "Analysing...":"Analyse"}
    </Button>
  );
}

export default AnalyseButton