"use client";
import { apiStudentApplications } from "@/app/api/ConvocatoriasEstudiante/studentApplications";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import base from "@/constants/base.json";
import nacional from "@/constants/nacional.json";
import internacional from "@/constants/internacional.json";
import { useRouter } from "next/navigation";
import File from "@/components/ConvsPage/File";

function ModifyCallPage({ params }) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin");
    },
  });

  const [region, setRegion] = useState("");
  const [comments, setComments] = useState("");

  const call_id = params.lambda;
  const token = session?.access;
  const user_type = session?.type_user;

  useEffect(() => {
    apiStudentApplications
      .getRegionFromCall(call_id, token)
      .then((response) => {
        setRegion(response.data.region);
      })
      .catch((error) => {
        console.log(error);
      });

    apiStudentApplications
      .getApplicationComments(call_id, token)
      .then((response) => {
        setComments(response.data.comment);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [token]);

  const router = useRouter();
  const id = params.lambda;

  /*const [convocatoria, setConvocatoria]=useState({})
  useEffect(()=>{
    apitypePos.getRegionCall(callId,token).then((response)=>{setConvocatoria(response.data)}).then(console.log(convocatoria)).catch((error)=>{console.log(error)})
  },[])*/

  // Pendiente agregar protección de rutas.

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  // const onSubmit = handleSubmit(() => {

  //   const result = {};
  //   if (region === "Nacional") {
  //     nacional.map((item) => {
  //       result[item.id] = values[item.id];
  //     });
  //   } else if (region === "Internacional") {
  //     internacional.map((item) => {
  //       result[item.id] = values[item.id];
  //     });
  //   } else {
  //     base.map((item) => {
  //       result[item.id] = values[item.id];
  //     });
  //   }
  //   // Validacion si todos tienen archivo
  //   let documents = true;
  //   Object.entries(result).map(([key, value]) => {
  //     if (value == undefined) {
  //       documents = false;
  //     }
  //   });
  //   if (!documents) {
  //     alert("No ha subido todos los documentos");
  //     return;
  //   } else {
  //     router.push("/Convocatorias/ConvocatoriasEstudiante");
  //   }

  // });

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
              <File
                id={item.id}
                title={item.title}
                nombrearchivo={item.id}
                onChange={(file) => handleChange(item.id, file)}
                allButtons={item.allButtons}
                call_id={id}
                Case={5}
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
              <File
                id={item.id}
                title={item.title}
                nombrearchivo={item.id}
                onChange={(file) => handleChange(item.id, file)}
                allButtons={item.allButtons}
                call_id={id}
                Case={5}
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
              <File
                id={item.id}
                title={item.title}
                nombrearchivo={item.id}
                onChange={(file) => handleChange(item.id, file)}
                allButtons={item.allButtons}
                call_id={id}
                Case={5}
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
  } else if (user_type === "employee") {
    redirect("/Convocatorias");
  } else {
    return (
      <>
        <main className="relative mt-4 mx-auto overflow-hidden max-w-[1580px] gap-3 p-2">
          <div className="p-8">
            <h1 className="text-black font-bold text-[35px]">
              Modificar postulación a la Convocatoria No. {id}
            </h1>
            <br />
            <p className="text-2xl text-justify pl-8 pr-10">
              En está sección puede subir sus documentos. De click en el
              recuadro para subir el documento que desee, una vez lo suba se va
              a mostrar el nombre de su archivo y un icono para eliminarlo si se
              equivoco de documento. Al lado encuentra el boton para descargar
              el archivo que subio, descargar el archivo original y finalmente
              el botón para cargar el documento a la base de datos.
            </p>
            <br />
            <p className="text-2xl text-justify pl-8 pr-10">
              Por favor cuando este seguro que su documento está correcto y
              corresponde a la casilla correspondiente, dele click en Subir para
              que se guarden. Una vez todos los documentos estén cargados, de
              click en enviar.
            </p>
            <h1 className="text-black font-bold text-[35px] pt-3">
              Comentarios:
            </h1>
            <br />
            <p className="text-2xl text-justify pl-8 pr-10">{comments}</p>
            <br />
            <div
              className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md"
              role="alert"
            >
              <div className="flex">
                <div className="py-1">
                  <svg
                    className="fill-current h-6 w-6 text-teal-500 mr-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold">El tamaño límite es 500KB</p>
                  <p className="text-sm">
                    Para cada uno de los documentos requeridos.
                  </p>
                </div>
              </div>
            </div>
            <br />
            <div>{regionForm()}</div>
          </div>
        </main>
      </>
    );
  }
}

export default ModifyCallPage;
