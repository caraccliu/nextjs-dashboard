import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import { CreateCustomer } from '@/app/ui/customers/buttons';
import { lusitana } from '@/app/ui/fonts';
import Table from '@/app/ui/customers/table';
import {fetchCustomers, fetchFilteredCustomers} from "@/app/lib/data";
import {FormattedCustomersTable} from "@/app/lib/definitions";
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import {fetchInvoicesPages} from "@/app/lib/data";
import {fetch} from "next/dist/compiled/@edge-runtime/primitives";
import {Metadata} from "next";
import {CreateInvoice} from "@/app/ui/invoices/buttons";

export const metadata: Metadata = {
    title: 'Customers',
};
export default async function Page(
    {
                                       searchParams,}:{
    searchParams?:{
        query?:string;
    };
}
)
{
    const query = searchParams?.query || '';
    return (
        <div className={"w-full"}>
            <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
                Customers
            </h1>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Search customers..." />
                <CreateCustomer />
            </div>
            <div className="flex w-full items-center justify-between">
            </div>
            <div>
                <Table query = {query}/>
            </div>
            {/*<Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton/>}>*/}
            {/*    <Table query={query} currentPage={currentPage}/>*/}
            {/*</Suspense>*/}
            {/*<div className="mt-5 flex w-full justify-center">*/}
            {/*    <Pagination totalPages={totalPage}/>*/}
            {/*</div>*/}
        </div>
    );
}