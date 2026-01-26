export default function Footer() {
    return (
        <footer className='bg-linear-to-r from-gray-900 via-teal-900 to-gray-800 text-center p-6 mt-8 shadow-inner rounded-t-2xl'>
            <p className='text-gray-200 font-bold text-lg mb-1'>
                Built by <span className='text-yellow-400'>Saptaparno Chakraborty</span>
            </p>
            <p className='text-gray-400 text-sm tracking-wide'>
                First MERN Learning Project • 2025
            </p>
            <div className='mt-3 h-1 w-24 mx-auto bg-yellow-400 rounded-full shadow-md'></div>
        </footer>
    );
}