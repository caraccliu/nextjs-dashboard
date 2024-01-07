import Form from '@/app/ui/customers/create-form';
import Breadcrums from '@/app/ui/invoices/breadcrumbs';
import {fetchCustomers} from '@/app/lib/data';
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Creat Customer | Acme',
};

export default async function Page(){
    const customers = await fetchCustomers();

    return (
        <main>
            <Breadcrums
                breadcrumbs={[
                    {label:'Customers', href:'/dashboard/customers'},
                    {
                        label:'Create Customer',
                        href:'dashboard/customers/create',
                        active:true,
                    }
                ]}
            />
            <Form customers={customers}/>
        </main>
    );
}