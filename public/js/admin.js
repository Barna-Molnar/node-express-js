const deleteProduct = async (buttonElement) => {
    const productId = buttonElement.parentNode.querySelector('[name=productId]').value;
    const csrfToken = buttonElement.parentNode.querySelector('[name=_csrf]').value;
    console.log('deleteProduct', { productId }, { csrfToken });

    try {
        console.log('deleteProduct start');
        const res = fetch(`/admin/product/${productId}`, {
            method: 'DELETE',
            headers: { 'csrf-token': csrfToken }
        });
        const result = await res
        console.log('deleteProduct result', result);
    } catch (error) {
        console.log('deleteProduct error', error);
    }

};