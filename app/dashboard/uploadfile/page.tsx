import Form from '@/app/ui/customers/create-form';
import Breadcrums from '@/app/ui/invoices/breadcrumbs';
import {fetchCustomers} from '@/app/lib/data';
import {Metadata} from "next";
import {lusitana} from "@/app/ui/fonts";
import Uploader from "./uploader";

export const metadata: Metadata = {
    title: 'Upload Customer image | Acme',
};

export default async function Page(){

    return (
        <div className={"w-full"}>
            <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
                React file upload
            </h1>
            <Uploader/>
        </div>
    );
}