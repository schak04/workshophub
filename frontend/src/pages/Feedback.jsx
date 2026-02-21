import {useEffect, useState} from 'react';
import api from '../api/axios';
import {useAuth} from '../context/AuthContext';
import {MessageSquare, Send, Filter} from 'lucide-react';

function RatingPill({ rating }) {
    return (
        <span className='inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200'>
            {'★'.repeat(Number(rating) || 0)} {rating ? `(${rating})` : ''}
        </span>
    );
}

export default function Feedback() {
    const {user} = useAuth();

    const [workshops, setWorkshops] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);

    const [workshop, setWorkshop] = useState('');
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');

    useEffect(() => {
        api.get('/workshops')
            .then(res => setWorkshops(res.data))
            .catch(err => console.error(err));
    }, []);

    const loadFeedback = async (workshopId = '') => {
        try {
            const res = await api.get(
                workshopId ? `/feedback?workshop=${workshopId}` : '/feedback'
            );
            setFeedbacks(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (user?.role === 'admin' || user?.role === 'instructor') {
            loadFeedback();
        }
    }, [user]);

    const submitFeedback = async (e) => {
        e.preventDefault();
        try {
            await api.post('/feedback', {
                workshop,
                rating,
                comment
            });

            setWorkshop('');
            setRating('');
            setComment('');
        } catch (err) {
            console.error(err);
            alert("Error submitting feedback");
        }
    };

    const filteredWorkshops =
        user?.role === 'admin'
            ? workshops
            : workshops.filter(w => w.instructor?._id === user?.id);

    return (
        <div className='space-y-8'>
            <div>
                <h1 className='text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100'>
                    Feedback
                </h1>
                <p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>
                    {user?.role === 'participant'
                        ? "Submit feedback for workshops you attended."
                        : "Review participant feedback across workshops."}
                </p>
            </div>

            {user?.role === 'participant' && (
                <div className='max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                    <div className='flex items-center gap-2 mb-6'>
                        <MessageSquare className='h-5 w-5 text-slate-500 dark:text-slate-400' />
                        <h2 className='text-sm font-semibold text-slate-900 dark:text-slate-100'>
                            Submit Workshop Feedback
                        </h2>
                    </div>

                    <form onSubmit={submitFeedback} className='grid gap-5 sm:grid-cols-2'>
                        <div className='sm:col-span-2'>
                            <label className='block text-sm font-medium text-slate-700 dark:text-slate-200'>
                                Workshop
                            </label>
                            <select
                                className='mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-teal-400/25 dark:focus:border-teal-400'
                                value={workshop}
                                onChange={e => setWorkshop(e.target.value)}
                                required
                            >
                                <option value=''>Choose a workshop...</option>
                                {workshops.map(w => (
                                    <option key={w._id} value={w._id}>
                                        {w.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-slate-700 dark:text-slate-200'>
                                Rating
                            </label>
                            <select
                                className='mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-teal-400/25 dark:focus:border-teal-400'
                                value={rating}
                                onChange={e => setRating(e.target.value)}
                                required
                            >
                                <option value=''>Select rating...</option>
                                {[1, 2, 3, 4, 5].map(r => (
                                    <option key={r} value={r}>
                                        {'★'.repeat(r)} ({r})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='sm:col-span-2'>
                            <label className='block text-sm font-medium text-slate-700 dark:text-slate-200'>
                                Comment (Optional)
                            </label>
                            <textarea
                                placeholder="Share your thoughts about the workshop..."
                                className='mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-teal-400/25 dark:focus:border-teal-400 resize-none'
                                rows={4}
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                            />
                        </div>

                        <div className='sm:col-span-2'>
                            <button
                                type='submit'
                                className='inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 transition-colors'
                            >
                                <Send className='h-4 w-4' />
                                Submit Feedback
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {(user?.role === 'admin' || user?.role === 'instructor') && (
                <div className='space-y-4'>
                    <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
                        <div>
                            <h2 className='text-sm font-semibold text-slate-900 dark:text-slate-100'>
                                Feedback Overview
                            </h2>
                            <p className='mt-1 text-sm text-slate-600 dark:text-slate-400'>
                                Filter feedback by workshop
                            </p>
                        </div>

                        <div className='max-w-md w-full sm:w-80'>
                            <label className='block text-sm font-medium text-slate-700 dark:text-slate-200'>
                                Workshop
                            </label>
                            <div className='relative mt-2'>
                                <Filter className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400' />
                                <select
                                    className='w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-teal-400/25 dark:focus:border-teal-400'
                                    onChange={e => loadFeedback(e.target.value)}
                                >
                                    <option value=''>All Workshops</option>
                                    {filteredWorkshops.map(w => (
                                        <option key={w._id} value={w._id}>
                                            {w.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className='overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900'>
                        <table className='min-w-full text-sm'>
                            <thead className='bg-slate-50 dark:bg-slate-950'>
                                <tr className='text-left text-slate-600 dark:text-slate-300'>
                                    <th className='px-6 py-4 font-medium'>Workshop</th>
                                    <th className='px-6 py-4 font-medium'>Participant</th>
                                    <th className='px-6 py-4 font-medium'>Rating</th>
                                    <th className='px-6 py-4 font-medium'>Comment</th>
                                    <th className='px-6 py-4 font-medium'>Date</th>
                                </tr>
                            </thead>

                            <tbody className='divide-y divide-slate-200 dark:divide-slate-800'>
                                {feedbacks.map(f => (
                                    <tr
                                        key={f._id}
                                        className='hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors'
                                    >
                                        <td className='px-6 py-4 font-medium text-slate-900 dark:text-slate-100'>
                                            {f.workshop?.title || 'Untitled workshop'}
                                        </td>
                                        <td className='px-6 py-4 text-slate-600 dark:text-slate-400'>
                                            {f.user?.name || 'Unnamed user'}
                                        </td>
                                        <td className='px-6 py-4'>
                                            <RatingPill rating={f.rating} />
                                        </td>
                                        <td className='px-6 py-4 text-slate-600 dark:text-slate-400' title={f.comment || 'No comment'}>
                                            {f.comment ? (
                                                <span className='line-clamp-2'>{f.comment}</span>
                                            ) : (
                                                <span className='text-slate-400 dark:text-slate-500 italic'>No comment</span>
                                            )}
                                        </td>
                                        <td className='px-6 py-4 text-slate-600 dark:text-slate-400'>
                                            {f.createdAt ? new Date(f.createdAt).toLocaleDateString() : 'Not available'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {feedbacks.length === 0 && (
                            <div className='px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400'>
                                No feedback found for the selected criteria.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}