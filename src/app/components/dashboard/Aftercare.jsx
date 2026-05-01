'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { CgAddR } from 'react-icons/cg';
import { RxCross2 } from 'react-icons/rx';
import AddAftercareModule from '../dashboard/AddAftercareModule';
import Loader from '../../components/Loader';
import { useRouter } from 'next/navigation';
import Pagination from '../../components/Pagination';
import { getAftercareList, updateAftercare as apiUpdateAftercare } from '@/lib/api/products';

function Aftercare() {
  const router = useRouter();
  const [aftercare, setAftercare] = useState([]);
  const [expandedAftercareId, setExpandedAftercareId] = useState(null);
  const [formData, setFormData] = useState({}); // editable fields
  const { data: session, status } = useSession();
  const [openAddForm, setOpenAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const toggleAftercare = aftercare => {
    if (expandedAftercareId === aftercare.id) {
      setExpandedAftercareId(null);
    } else {
      setExpandedAftercareId(aftercare.id);
      setFormData({
        // populate form fields on expand
        ItemType: aftercare.ItemType || '',
        name: aftercare.name || '',
        description: aftercare.description || '',
        price: aftercare.price || 0,
        quantity: aftercare.quantity || 0
      });
    }
  };

  const fetchAftercare = async() => {
    try {
      const json = await getAftercareList({ page, pageSize: 12, withImage: true });
      setAftercare(json?.data?.length ? json.data : []);
    } catch {
      setAftercare([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAftercare();
  }, [page]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateaftercare = async id => {
    try {
      await apiUpdateAftercare(id, formData, session?.jwt);
      fetchAftercare();
    } catch {
      alert('Failed to update aftercare.');
    }
  };

  if (status === 'loading') return <Loader />;
  if (loading) return <Loader />;

  return (
    <div className='p-4'>
      <div className='relative'>
        <h1 className='text-center text-2xl mb-6'>Aftercare</h1>

        <CgAddR
          className={
            openAddForm
              ? 'hidden'
              : 'absolute right-4 top-1 text-2xl hover:cursor-pointer'
          }
          onClick={() => setOpenAddForm(!openAddForm)}
        />

        <RxCross2
          className={
            !openAddForm
              ? 'hidden'
              : 'absolute right-4 top-1 text-2xl hover:cursor-pointer'
          }
          onClick={() => setOpenAddForm(!openAddForm)}
        />
      </div>

      {openAddForm && (
        <AddAftercareModule
          openAddForm={openAddForm}
          setOpenAddForm={setOpenAddForm}
          fetchAftercare={fetchAftercare}
        />
      )}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mx-4'>
        {aftercare.map(aftercare => (
          <div key={aftercare.id} className='bg-white rounded-lg shadow p-4'>
            <div
              className='flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition p-2 rounded'
              onClick={() => toggleAftercare(aftercare)}
            >
              
              <Image
                src={
                  aftercare?.image?.formats?.thumbnail?.url ||
                  aftercare?.image?.url
                }
                width={aftercare?.image?.formats?.thumbnail?.width || 200}
                height={aftercare?.image?.formats?.thumbnail?.height || 200}
                alt={aftercare.name}
                className='rounded-md object-cover'
              />
              <span className='text-xl font-semibold'>{aftercare?.name}</span>
            </div>

            {expandedAftercareId === aftercare.id && (
              <div className='mt-4 border-t pt-4'>
                <form className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  {[
                    { label: 'Item Type', name: 'ItemType' },
                    { label: 'Name', name: 'name' },
                    { label: 'Price', name: 'price' },
                    { label: 'Quantity', name: 'quantity' }
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
                        className='border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
                      />
                    </div>
                  ))}

                  <div className='flex flex-col'>
                    <label className='text-sm font-medium text-gray-700 mb-1'>
                      Description
                    </label>
                    <textarea
                      name='description'
                      value={formData.description || ''}
                      onChange={handleInputChange}
                      placeholder='Description'
                      className='border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
                    ></textarea>
                  </div>
                </form>

                <div className='flex justify-end mt-4'>
                  <button
                    className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'
                    onClick={() => updateaftercare(aftercare?.documentId)}
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
        <Pagination page={page} setPage={setPage} length={aftercare.length} />
      </div>
    </div>
  );
}

export default Aftercare;
