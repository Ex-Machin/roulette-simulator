// src/components/Contact.js

'use client';
import emailjs from '@emailjs/browser';
import { FormEvent, useState } from 'react'

export default function Contact() {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<boolean>(false)

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        emailjs.init("dYN-GyK3RJbBzst6q"), []
        event.preventDefault()
        setIsLoading(true)
        setError(null) // Clear previous errors when a new request starts

        try {
            const formData = new FormData(event.currentTarget)
            await emailjs.send('service_kwej7f9', 'template_rd8x0qh', {
                to_name: "Dmytro",
                from_name: formData.get('name'),
                reply_to: formData.get('email'),
                message: formData.get('message')
            })
            setSuccess(true)

        } catch (error: any) {
            // Capture the error message to display to the user
            setError(error.message)
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <section id="contact" className="relative">
            <div className="container px-5 py-10 mx-auto flex sm:flex-nowrap flex-wrap">
                <div className="lg:w-2/3 md:w-1/2 bg-gray-900 rounded-lg overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d148196.12458494876!2d18.469209073787773!3d54.52354239299936!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46fda145071ed789%3A0xdee2f99989236636!2sGdynia!5e0!3m2!1sde!2spl!4v1729516014233!5m2!1sde!2spl"
                        width="100%"
                        height="100%"
                        title="map"
                        className="absolute inset-0"
                        style={{ filter: "opacity(0.7)" }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade" />
                    <div className="bg-gray-900 relative flex flex-wrap py-6 rounded shadow-md">
                        <div className="lg:w-1/3 px-6">
                            <h2 className="title-font font-semibold text-white tracking-widest text-xs">
                                ADDRESS
                            </h2>
                            <p className="mt-1">
                                Gdynia, Poland
                            </p>
                        </div>
                        <div className="lg:w-2/3 px-6 mt-4 lg:mt-0">
                            <h2 className="title-font font-semibold text-white tracking-widest text-xs">
                                EMAIL
                            </h2>
                            <a className="text-indigo-400 leading-relaxed">
                                dmytromykhailiuk6@gmail.com
                            </a>
                            <h2 className="title-font font-semibold text-white tracking-widest text-xs mt-4">
                                PHONE
                            </h2>
                            <p className="leading-relaxed">+48 733 207 310</p>
                        </div>
                    </div>
                </div>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                {success && <div style={{ color: 'green' }}>Message sent successfully</div>}
                {!success &&
                    <form
                        // netlify={true}
                        onSubmit={onSubmit}
                        name="contact"
                        className="lg:w-1/3 md:w-1/2 flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0">
                        <h2 className="text-white sm:text-4xl text-3xl mb-1 font-medium title-font">
                            Hire Me
                        </h2>
                        <p className="leading-relaxed mb-5">
                            Please contact me, if you are interested in collaboration
                        </p>
                        <div className="relative mb-4">
                            <label htmlFor="name" className="leading-7 text-sm text-gray-400">
                                Name
                            </label>
                            <input
                                type="text"
                                id='name'
                                name='name'
                                required
                                className="w-full bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            />
                        </div>
                        <div className="relative mb-4">
                            <label htmlFor="email" className="leading-7 text-sm text-gray-400">
                                Email
                            </label>
                            <input
                                type="email"
                                id='email'
                                name='email'
                                required
                                className="w-full bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            />
                        </div>
                        <div className="relative mb-4">
                            <label
                                htmlFor="message"
                                className="leading-7 text-sm text-gray-400">
                                Message
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                className="w-full bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 h-32 text-base outline-none text-gray-100 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                            />
                        </div>
                        <button
                            type="submit"
                            value="Send"
                            disabled={isLoading}
                            className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">
                            {isLoading ? 'Loading...' : 'Submit'}
                        </button>
                    </form>

                }

            </div>
        </section>
    );
}