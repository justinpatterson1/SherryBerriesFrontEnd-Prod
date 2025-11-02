'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { CgAddR } from 'react-icons/cg';
import { RxCross2 } from 'react-icons/rx';
import AddJewelryModule from '../dashboard/AddJewelryModule';
import Loader from '../../components/Loader';
import Pagination from '../../components/Pagination';

function Jewelry() {
  const [page, setPage] = useState(1);
  const [jewelry, setJewelry] = useState([]);
  const [expandedJewelryId, setExpandedJewelryId] = useState(null);
  const [formData, setFormData] = useState({}); // editable fields
  const { data: session, status } = useSession();
  const [openAddForm, setOpenAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  console.log('Jewelry page:' + JSON.stringify(session));
  const toggleJewelry = jewel => {
    if (expandedJewelryId === jewel.id) {
      setExpandedJewelryId(null);
    } else {
      setExpandedJewelryId(jewel.id);
      setFormData({
        // populate form fields on expand
        name: jewel.name || '',
        ItemType: jewel.ItemType || '',
        category: jewel.category || '',
        color: jewel.color || '',
        isFeatured: jewel.featured ? 'true' : 'false',
        material: jewel.material || '',
        price: jewel.price || '',
        discount: jewel.discount || 0
      });
    }
  };

  const fetchJewelries = async() => {
    fetch(
      `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/jewelries?populate[0]=image&populate[1]=sizes&pagination[page]=${page}&pagination[pageSize]=12`
    )
      .then(res => res.json())
      .then(json => {
        if (json?.data.length !== 0) {
          setJewelry(json?.data);
          setLoading(false);
        } else {
          setJewelry([]);
          setLoading(false);
        }
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchJewelries();
  }, [page]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const updateJewelry = async id => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SHERRYBERRIES_URL}/api/jewelries/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${session?.jwt}`
          },
          body: JSON.stringify({ data: formData })
        }
      );

      if (res.ok) {
        fetchJewelries();
      } else {
        alert('Failed to update jewelry.');
      }
    } catch (err) {
      console.error('Update error:', err);
    }
    console.log(id);
    console.log(formData);
  };

  if (status === 'loading') return <Loader />;
  if (loading) return <Loader />;

  return (
    <div className='p-4'>
      <div className='relative'>
        <h1 className='text-center text-2xl mb-6'>Jewelry</h1>

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
        <AddJewelryModule
          openAddForm={openAddForm}
          setOpenAddForm={setOpenAddForm}
          fetchJewelries={fetchJewelries}
        />
      )}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mx-4'>
        {jewelry.map(jewel => (
          <div key={jewel.id} className='bg-white rounded-lg shadow p-4'>
            <div
              className='flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition p-2 rounded'
              onClick={() => toggleJewelry(jewel)}
            >
              {console.log(JSON.stringify(jewel.image.formats))}
              <Image
                src={jewel?.image?.formats?.thumbnail?.url || jewel?.image?.url}
                width={jewel?.image?.formats?.thumbnail?.width || 200}
                height={jewel?.image?.formats?.thumbnail?.height || 200}
                alt={jewel.name}
                className='rounded-md object-cover'
              />
              <span className='text-xl font-semibold'>{jewel?.name}</span>
            </div>

            {expandedJewelryId === jewel.id && (
              <div className='mt-4 border-t pt-4'>
                <form className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  {[
                    { label: 'Name', name: 'name' },
                    { label: 'Item Type', name: 'ItemType' },
                    { label: 'Color', name: 'color' },
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
                        className='border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
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
                      className='border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
                    />
                  </div>

                  <div className='flex flex-col'>
                    <label className='text-sm font-medium text-gray-700 mb-1'>
                      Material
                    </label>
                    <select
                      name='isFeatured'
                      value={formData.material}
                      onChange={handleInputChange}
                      className='border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
                    >
                      <option value=''>Select</option>
                      <option value='Gold'>Gold</option>
                      <option value='Silver'>Silver</option>
                      <option value='Acryli'>Acrylic</option>
                      <option value='Plastic'>Plastic</option>
                      <option value='Stainless-Steel'>Stainless-Steel</option>
                    </select>
                  </div>

                  <div className='flex flex-col'>
                    <label className='text-sm font-medium text-gray-700 mb-1'>
                      Category
                    </label>
                    <select
                      name='isFeatured'
                      value={formData.category}
                      onChange={handleInputChange}
                      className='border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
                    >
                      <option value=''>Select</option>
                      <option value='Gold'>Nose-Ring</option>
                      <option value='Silver'>Belly-Ring</option>
                      <option value='Acryli'>Septum</option>
                      <option value='Plastic'>Tragus</option>
                    </select>
                  </div>

                  <div className='flex flex-col'>
                    <label className='text-sm font-medium mb-1'>Featured</label>
                    <select
                      name='featured'
                      value={formData.featured}
                      onChange={handleInputChange}
                      className='border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400'
                    >
                      <option value='true'>True</option>
                      <option value='false'>False</option>
                    </select>
                  </div>
                </form>

                <div className='flex justify-end mt-4'>
                  <button
                    className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'
                    onClick={() => updateJewelry(jewel?.documentId)}
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
        <Pagination page={page} setPage={setPage} length={jewelry.length} />
      </div>
    </div>
  );
}

export default Jewelry;
