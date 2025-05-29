// src/pages/careers/CareersPage.jsx
export default function CareersPage() {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Careers</h1>
        <form className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full p-2 border"/>
          <input type="email" placeholder="Email" className="w-full p-2 border"/>
          <textarea placeholder="Why you?" className="w-full p-2 border"/>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2">
            Submit Application
          </button>
        </form>
      </div>
    );
  }