import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import Table from '@/app/ui/customers/table';
import {fetchCustomers, fetchFilteredCustomers} from "@/app/lib/data";
import {FormattedCustomersTable} from "@/app/lib/definitions";
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import {fetchInvoicesPages} from "@/app/lib/data";
import {fetch} from "next/dist/compiled/@edge-runtime/primitives";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Customers',
};
export default async function Page(
//     {
//                                        searchParams,}:{
//     searchParams?:{
//         query?:string;
//         page?:string;
//     };
// }
)
{
    // const query = searchParams?.query || '';
    // const currentPage = Number(searchParams?.page) || 1;
    // const totalPage = await fetchInvoicesPages(query);
    const customers = await fetchFilteredCustomers("");
    return (
        <div className={"w-full"}>
            <div className="flex w-full items-center justify-between">
            </div>
            <div>
                <Table customers={customers}/>
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