"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import { adminApplications } from "@/app/api/ConvocatoriasAdmin/adminApplications.js";
import Archivo from "./Archivo.jsx";
import Comentarios from "./Comentarios.jsx";
import { apiStudentApplications } from "@/app/api/ConvocatoriasEstudiante/studentApplications.js";
import base from "@/constants/base.json";
import nacional from "@/constants/nacional.json";
import internacional from "@/constants/internacional.json";

function VerPostulacionDocumentos({ params }) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin");
    },
  });
  const token = session?.access;
  const user_type = session?.type_user;
  const callId = params.call_id;
  const studentId = params.student_id;

  const [applicationData, setApplicationData] = useState({});
  const [region, setRegion] = useState("");

  useEffect(() => {
    adminApplications
      .getStudentDocuments(callId, studentId, token)
      .then((response) => {
        setApplicationData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    apiStudentApplications
      .getRegionFromCall(callId, token)
      .then((response) => {
        setRegion(response.data.region);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token]);

  const {
    formState: { errors },
  } = useForm();

  const handleAskModification = () => {
    adminApplications
      .putApplicationModification(callId, studentId, token)
      .then((response) => {
        alert("Modification request saved.");
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleApproveApplication = () => {
    adminApplications
      .putAcceptDocuments(callId, studentId, token)
      .then((response) => {
        alert("Documents approved.");
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [values, setValues] = useState(() => {
    if (region === "Nacional") {
      return { ...nacional };
    } else if (region === "Internacional") {
      return { ...internacional };
    } else {
      return { ...base };
    }
  });

  const handleChange = (key, file) => {
    setValues((prevValues) => ({
      ...prevValues,
      [key]: file,
    }));
  };

  const regionForm = () => {
    if (region === "Nacional") {
      return (
        <div>
          {nacional.map((item, index) => (
            <div key={index}>
              <Archivo
                key={index}
                fileName={item.id}
                title={item.title}
                applicationDocuments={applicationData.documents}
                onChange={(file) => handleChange(item.id, file)}
                allButtons={item.allButtons}
                call_id={callId}
                token={token}
              />
            </div>
          ))}
        </div>
      );
    } else if (region === "Internacional") {
      return (
        <div>
          {internacional.map((item, index) => (
            <div key={index}>
              <Archivo
                key={index}
                fileName={item.id}
                title={item.title}
                applicationDocuments={applicationData.documents}
                onChange={(file) => handleChange(item.id, file)}
                allButtons={item.allButtons}
                call_id={callId}
                token={token}
              />
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div>
          {base.map((item, index) => (
            <div key={index}>
              <Archivo
                key={index}
                fileName={item.id}
                title={item.title}
                applicationDocuments={applicationData.documents}
                onChange={(file) => handleChange(item.id, file)}
                allButtons={item.allButtons}
                call_id={callId}
                token={token}
              />
            </div>
          ))}
        </div>
      );
    }
  };

  if (!session) {
    return <div>{status}...</div>;
  } else if (user_type === "student") {
    redirect("/Convocatorias");
  } else {
    return (
      <div className="p-8">
        <h1 className="text-black font-bold text-[35px]">
          Documentos para la convocatoria No. {callId}
        </h1>
        <br />
        <p className="text-2xl text-justify pl-8 pr-10">
          A continuacion se encuentran los documentos enviados por el estudiante
          con número de documento {studentId}
          para postularse a esta convocatoria.
        </p>
        <br />
        <p className="text-2xl text-justify pl-8 pr-10">
          Por favor revisar que los documentos cumplen con las condiciones
          solicitadas para la convocatoria. De ser necesario un cambio en los
          documentos, podra dejar un comentario al final de esta seleccion y
          notificar al estudiante y para realizar las correciones necesarias.
        </p>
        <br />
        <div>
          <div>{regionForm()}</div>
          <br />
          <h1 className="text-2xl font-bold text-center">
            A continuación, asigne el estado de esta Postulación.
          </h1>
          <br />
          <div className="flex">
            <button
              type="button"
              onClick={handleAskModification}
              className="flex-1 mr-2 font-semibold bg-figma_blue border-2 rounded-full border-figma_blue text-white hover:text-figma_blue hover:bg-white py-2"
            >
              Pendiente de modificación
            </button>

            <button
              type="button"
              onClick={handleApproveApplication}
              className="flex-1 ml-2 font-semibold bg-figma_blue border-2 rounded-full border-figma_blue text-white hover:text-figma_blue hover:bg-white py-2"
            >
              Aceptado
            </button>
          </div>
          <br />
        </div>
        <Comentarios call_id={callId} student_id={studentId} token={token} />
      </div>
    );
  }
}
export default VerPostulacionDocumentos;
