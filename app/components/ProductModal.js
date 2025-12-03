'use client';

import { Modal, Form, Input, InputNumber, App } from 'antd';
import { useEffect } from 'react';
import api from '../utils/api';

const ProductModalContent = ({ isOpen, onClose, refreshData, editingProduct }) => {
    const { message } = App.useApp(); 
    const [form] = Form.useForm();
    const isEdit = !!editingProduct; 

    useEffect(() => {
        if (isOpen) {
            if (editingProduct) {
                form.setFieldsValue(editingProduct);
            } else {
                form.resetFields();
            }
        }
    }, [isOpen, editingProduct, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            let result;

            // ✅ PERBAIKAN: Deklarasikan payload dan inisialisasi dengan values
            // Ini mengatasi ReferenceError: payload is not defined
            let payload = values;

            if (isEdit) {
                // Di mode EDIT, payload sama dengan values yang divalidasi.
                // Kita mengirimkannya bersama ID dari produk yang sedang diedit.
                result = await api.updateProduct(editingProduct.id, payload);
            } else {
                // Di mode CREATE, kita mengirimkan payload (values)
                result = await api.createProduct(payload);
            }
            
            // Logika penanganan hasil operasi API
            if (result !== false) {
                message.success(`Product ${isEdit ? 'updated' : 'created'} successfully`);
                refreshData();
                onClose();
                form.resetFields();
            } else {
                message.error('Operation failed: API request denied or failed.');
            }

        } catch (error) {            
            message.error('Please check your form inputs.');
        }

    };

    return (
        <Modal
            title={isEdit ? "Edit Product" : "Add Product"}
            open={isOpen}
            onOk={handleOk}
            onCancel={onClose}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input name' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Please input description' }]}>
                    <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item name="price" label="Price" rules={[{ required: true, message: 'Please input price' }]}>
                    <InputNumber 
                        style={{ width: '100%' }} 
                        prefix="Rp" 
                        // Menggunakan parser dan formatter yang benar untuk Price
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 
                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    />
                </Form.Item>
                <Form.Item name="stock" label="Stock" rules={[{ required: true, message: 'Please input stock' }]}>
                    <InputNumber style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please input category' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="image" label="Image URL" rules={[{ required: true, type: 'url', message: 'Please input a valid URL' }]}>
                    <Input placeholder="https://..." />
                </Form.Item>
            </Form>
        </Modal>
    );
};

const ProductModal = (props) => (
    <App>
        <ProductModalContent {...props} />
    </App>
);

export default ProductModal;