import UniversitiesCard from "@/components/UniversitiesPage/UniversitiesCard";
import Link from "next/link";
import React from "react";

function UniversitiesMainPage() {
  return (
    <>
      <main className="relative mt-4 mx-auto overflow-hidden max-w-[1580px] gap-4 p-2">
        <Link href="/Universidades/CrearUniversidad" className="">
          <p className="underline pb-3 font-bold">Registrar una universidad</p>
        </Link>
        <div className="grid grid-cols-3 w-full gap-6">
          <UniversitiesCard
            id={1}
            country="colombia"
            city="bogota"
            webpage="zzz"
            exchange_info="good night"
            name="akakaka"
            region="hola"
          />
          <UniversitiesCard
            id={1}
            country="colombia"
            city="bogota"
            webpage="zzz"
            exchange_info="good night"
            name="akakaka"
            region="hola"
          />
          <UniversitiesCard
            id={1}
            country="colombia"
            city="bogota"
            webpage="zzz"
            exchange_info="good night"
            name="akakaka"
            region="hola"
          />
        </div>
      </main>
    </>
  );
}

export default UniversitiesMainPage;
