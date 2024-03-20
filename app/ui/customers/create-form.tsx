'use client';
import { CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import {useFormState} from 'react-dom';
import React from 'react';
import { useState, useCallback, useMemo, ChangeEvent } from "react";
import { toast } from "sonner";
import {
    CheckIcon,
    ClockIcon,
    CurrencyDollarIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import {createCustomer} from "@/app/lib/actions";

export default function Form({ customers }: { customers: CustomerField[] }) {
    const [data, setData] = useState<{
        image: string | null;
    }>({
        image: null,
    });
    const [file, setFile] = useState<File | null>(null);

    const onChangePicture = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const file = event.currentTarget.files && event.currentTarget.files[0];
            if (file) {
                if (file.size / 1024 / 1024 > 50) {
                    toast.error("File size too big (max 50MB)");
                } else {
                    setFile(file);
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setData((prev) => ({ ...prev, image: e.target?.result as string }));
                    };
                    reader.readAsDataURL(file);
                }
            }
        },
        [setData],
    );


    const initialState = {message:null, errors:{}}
    const [state, dispatch] = useFormState(createCustomer, initialState);
    return (
        <form action={dispatch}  >
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/*name*/}
                <div className="mb-4">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium">
                        customer name
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="name"
                                name="name"
                                type="string"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            />
                        </div>
                    </div>
                    <div id="name-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.name &&
                            state.errors.name.map((error:string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>
                {/*email */}
                <div className="mb-4">
                    <label htmlFor="amount" className="mb-2 block text-sm font-medium">
                        customer email address
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="email"
                                name="email"
                                type="string"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            />
                        </div>
                    </div>
                    <div id="email-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.email &&
                            state.errors.email.map((error:string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>
                {/*upload image*/}
                <div className="mb-5">
                    <label htmlFor="image" className="mb-2 block text-sm font-medium">Image</label>
                    <input
                        type="file"
                        name = "image"
                        className="mb-2 block text-sm font-medium"
                        // onChange={onChangePicture}
                    />
                    <button type="submit">Upload</button>
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/dashboard/customers"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <Button type="submit">Create Customer</Button>
            </div>
        </form>
    );
}