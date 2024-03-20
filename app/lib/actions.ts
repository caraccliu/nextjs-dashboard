'use server';
import {z} from 'zod';
import {sql} from '@vercel/postgres';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {signIn} from '@/auth';
import {AuthError} from 'next-auth';
import {Auth} from "@auth/core";
import {fetchCustomers} from "@/app/lib/data";
import {User} from "@/app/lib/definitions";
import axios from 'axios';

const FormSchema = z.object({
  id:z.string(),
  customerId:z.string({
      invalid_type_error:'Please select a customer',
  }),
  amount:z.coerce.number().gt(0,{message:'Please enter an amount greater than $0.'}),
  status:z.enum(['pending','paid'],{
      invalid_type_error:'Please select an invoice status.'
  }),
    date:z.string(),
});
const CustomerFormScheme = z.object({
    id:z.string(),
    name:z.string().min(5, {message:'Please enter a name with at least five letters'}),
    email:z.string().email({message:'Please enter a valid email address'}),
    image_url:z.string(),
    image:z.string(),
});

const CreateInvoice = FormSchema.omit({id:true,date:true});

const CreateCustomer = CustomerFormScheme.omit({id:true, image_url: true,image:true});
const UpdateInvoice = FormSchema.omit({id:true, date:true});

export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
}
export type CustomerInfo = {
    errors?:{
        name?:string[];
        email?:string[];
    };
    message?:string|null;
}

export async function createCustomer(prevState: CustomerInfo, formData: FormData){
   const validateFields = CreateCustomer.safeParse({
       name:formData.get('name'),
       email:formData.get('email'),
       image:formData.get('image'),
   });
   const imageFiles = formData.get('image');
   if(!validateFields.success){
       return{
           errors: validateFields.error.flatten().fieldErrors,
           message: 'Missing Fields. Failed to Create Customer.',
       }
   }
   const {name, email} = validateFields.data;
   console.log(validateFields);
   //post image to where
    const url = "http://localhost:3000/api/upload";
    try {
        console.log(formData);
        const response = await axios.post('http://localhost:3000/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response.data); // Handle the response from the server
    } catch (error) {
        console.error('Error uploading file:', error);
    }

    const user = await sql`SELECT * FROM customers WHERE email='balazs@orban.com'`;
    const image_url_row =  user.rows[0];
    const image_url = image_url_row.image_url;
   try{
       await sql`
        INSERT INTO customers (name, email,image_url)
        VALUES (${name}, ${email}, ${image_url})`;
   }catch (error){
       return {
           message:'Database error: failed to create customer',
       }
   }
   revalidatePath('/dashboard/customers');
   redirect('/dashboard/customers');
}
export async function createInvoice(prevState: State,formData: FormData){
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount:formData.get('amount'),
        status:formData.get('status'),
    });
    if(!validatedFields.success){
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        }
    }

    const {customerId, amount, status} = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    try{
        await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId},${amountInCents},${status}, ${date})
        `;
    } catch(error) {
        return {
            message:'Database error: failed to create invoice',
        };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id:string, state:State,formData:FormData){
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount:formData.get('amount'),
        status:formData.get('status'),
    });
    if(!validatedFields.success){
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        }
    }
    const {customerId, amount, status} = validatedFields.data;
    const amountInCents = amount * 100;
    try{
        await sql `
        UPDATE invoices
        SET customer_id = ${customerId},amount=${amountInCents}, status = ${status}
        WHERE id = ${id}`;
    }catch(error){
        return {
            message: "Database error: failed to update invoice",
        };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id:string,){
    try{
        await sql`
        DELETE FROM invoices WHERE id=${id}`;
        revalidatePath('/dashboard/invoices');
        return {message:'Deleted invoice'};
    }catch(error){
       return {
           message:"Database error: failed to delete invoice",
       };
    }
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}
