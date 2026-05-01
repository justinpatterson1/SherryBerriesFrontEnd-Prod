'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { CgAddR } from 'react-icons/cg';
import { RxCross2 } from 'react-icons/rx';
import AddWaistbeadModule from '../dashboard/AddWaistbeadModule.jsx';
import Loader from '../../components/Loader';
import Pagination from '../../components/Pagination';
import { getWaistbeadsListWithImage, updateWaistbeads as apiUpdateWaistbeads } from '@/lib/api/products';

function Waistbeads() {
  const [waistbead, setWaistbead] = useState([]);
  const [expandedWaistbeadId, setExpandedWaistbeadId] = useState(null);
  const [formData, setFormData] = useState({});
  const { data: session, status } = useSession();
  const [openAddForm, setOpenAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const toggleWaistbead = waistbead => {
    if (expandedWaistbeadId === waistbead.id) {
      setExpandedWaistbeadId(null);
    } else {
      setExpandedWaistbeadId(waistbead.id);
      setFormData({
        Name: waistbead.Name || '',
        ItemType: waistbead.ItemType || '',
        category: waistbead.category || '',
        isFeatured: waistbead.featured ? 'true' : 'false',
        price: waistbead.price || '',
        discount: waistbead.discount || 0
      });
    }
  };

  const fetchWaistbeads = async() => {
    try {
      const json = await getWaistbeadsListWithImage({ page, pageSize: 12 });
      setWaistbead(json?.data?.length ? json.data : []);
    } catch {
      setWaistbead([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchWaistbeads();
  }, [page]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateWaistbead = async id => {
    try {
      await apiUpdateWaistbeads(id, formData, session?.jwt);
      fetchWaistbeads();
    } catch {
      alert('Failed to update waistbead.');
    }
  };

  if (status === 'loading' || loading) return <Loader />;

  return (
    <div className='px-2 sm:px-4 lg:px-8 py-4'>
      <div className='relative mb-6 flex justify-center items-center'>
        <h1 className='text-xl sm:text-2xl font-bold'>Waistbeads</h1>
        <CgAddR
          className={`absolute right-4 sm:right-6 top-1 text-xl sm:text-2xl hover:cursor-pointer ${openAddForm ? 'hidden' : ''}`}
          onClick={() => setOpenAddForm(!openAddForm)}
        />
        <RxCross2
          className={`absolute right-4 sm:right-6 top-1 text-xl sm:text-2xl hover:cursor-pointer ${!openAddForm ? 'hidden' : ''}`}
          onClick={() => setOpenAddForm(!openAddForm)}
        />
      </div>

      {openAddForm && (
        <AddWaistbeadModule
          openAddForm={openAddForm}
          setOpenAddForm={setOpenAddForm}
          fetchWaistbeads={fetchWaistbeads}
        />
      )}

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
        {waistbead.map(waistbead => (
          <div key={waistbead.id} className='bg-white rounded-lg shadow p-4'>
            <div
              className='flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition p-2 rounded'
              onClick={() => toggleWaistbead(waistbead)}
            >
              <Image
                src={
                  waistbead?.image?.formats?.thumbnail?.url ||
                  waistbead?.image?.url
                }
                width={waistbead?.image?.formats?.thumbnail?.width || 200}
                height={waistbead?.image?.formats?.thumbnail?.height || 200}
                alt={waistbead.Name}
                className='rounded-md object-cover w-24 h-24 sm:w-32 sm:h-32'
              />
              <span className='text-base sm:text-lg font-semibold'>
                {waistbead?.Name}
              </span>
            </div>

            {expandedWaistbeadId === waistbead.id && (
              <div className='mt-4 border-t pt-4 max-h-[80vh] overflow-y-auto'>
                <form className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  {[
                    { label: 'Name', name: 'Name' },
                    { label: 'Item Type', name: 'ItemType' },
                    { label: 'Price', name: 'price' }
                  ].map(field => (
                    <div key={field.name} className='flex flex-col'>
                      <label className='text-sm font-medium mb-1'>
                        {field.label}
                      </label>
                      <input
                        type='text'
                        name={field.name}
                        value={formData[field.name] || ''}
                        onChange={handleInputChange}
                        className='border border-gray-300 p-2 text-sm sm:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
                      />
                    </div>
                  ))}

                  <div className='flex flex-col'>
                    <label className='text-sm font-medium mb-1'>Discount</label>
                    <input
                      type='text'
                      name='discount'
                      value={formData.discount || ''}
                      onChange={handleInputChange}
                      className='border border-gray-300 p-2 text-sm sm:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
                    />
                  </div>

                  <div className='flex flex-col'>
                    <label className='text-sm font-medium mb-1'>Featured</label>
                    <select
                      name='featured'
                      value={formData.featured}
                      onChange={handleInputChange}
                      className='border border-gray-300 p-2 text-sm sm:text-base rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
                    >
                      <option value='true'>True</option>
                      <option value='false'>False</option>
                    </select>
                  </div>
                </form>

                <div className='flex justify-end mt-4'>
                  <button
                    className='w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded hover:bg-blue-700 transition'
                    onClick={() => updateWaistbead(waistbead?.documentId)}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className='mt-10'>
        <Pagination page={page} setPage={setPage} length={waistbead.length} />
      </div>
    </div>
  );
}

export default Waistbeads;
