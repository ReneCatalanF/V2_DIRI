import { MouseEventHandler, useContext, useState } from "react";
import { MenuItem } from "../entites/entities";
import { foodItemsContext } from "../App";
import './FoorOrder.css';
import ima from '../images/Hamburg.jpg';
import logger from "../services/logging";

interface FoodOrderProps {
    food: MenuItem;
    onReturnToMenu: MouseEventHandler<HTMLButtonElement> | undefined;
}
function FoodOrder(props: FoodOrderProps) {
    if(props.food.quantity <=0){
        throw new Error('Ya no quedan hamburguesas '+props.food.name+' ,tenemos ' + props.food.quantity+' ahora mismo');
    }

    const [quantity, setQuantity] = useState(1);
    const [selectquantity, setSelectQuantity] = useState(0);

    const menuItems: MenuItem[] = useContext(foodItemsContext)

    const [isOrder, setisOrder] = useState<boolean>(false);
    const [excede, setExcede] = useState<boolean>(false);

    const handleClick = () => {
        logger.debug("Se hace click en Ordenar");
        menuItems.map((item: MenuItem) => {
            if (item.id === props.food.id) {
                logger.info("Se ordenan "+item.quantity + " "+item.name);
                item.quantity = item.quantity - quantity;
            }
        });
        setExcede(false);
        setisOrder(true);
        //props.onReturnToMenu();
    };

    const handleExcede = () => {
        logger.debug("Entendido el excede");
        setSelectQuantity(0)
        setExcede(false);
        setisOrder(false);
        
    };

    const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        logger.debug("Se cambia cantidad de hamburguesas a solciitar");
        const inputValue = event.target.value;
        const parsedQuantity = parseInt(inputValue, 10); // Convierte a número

        if (!isNaN(parsedQuantity) ) { // Verifica si la conversión fue exitosa
            
            if(parsedQuantity < props.food.quantity - 1 ){
                logger.info("Se convierte OK a numero: "+parsedQuantity+" y nuevo precio actualizado: "+props.food.price * parsedQuantity);
                setSelectQuantity(0);
                setExcede(false);
                setQuantity(parsedQuantity);
            }else{
                logger.error("Se excede cantidad máxima que se puede solicitar");
                setSelectQuantity(parsedQuantity);
                setExcede(true);
            }
            
        } else if (inputValue === "") {
            logger.error("Error al convertir numero, se vuelve 0");
            setQuantity(0); // Permite borrar el input y volver a 0
        }
    };


    return (
        <>
            {isOrder === true && (
                <div>
                    <h4>Pedido realizado</h4>
                </div>
            )}

            {excede === true && (
                <div>
                    <h4>Excedes la cantidad total de hamburguesas que puedes pedir: {props.food.quantity - 1}
                         y estas ingresando {selectquantity}</h4>
                    <button onClick={() =>
                        handleExcede()}>Entendido</button>
                </div>
            )}
            <div>
                <img
                    className="foodImg"
                    src={ima}
                    alt={props.food.name}
                />
                <h5>Nombre: </h5>
                <p>{props.food.name}</p>
                <h5>Precio: </h5>
                <p>{props.food.price * quantity}</p>
                <h5>Cantidad total que se puede pedir: </h5>
                <p>{props.food.quantity -1}</p>
                <br />
                <div>
                    <label>Cantidad a ordenar: </label>
                    <input
                        data-testid="foodPriceF"
                        type="number"
                        id="cantidad"
                        className="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        min="0"
                    />
                    <button onClick={() =>
                        handleClick()}>Ordenar</button>
                </div>
                <button onClick={props.onReturnToMenu}>Volver al menú</button>
            </div>
        </>
    );
};
export default FoodOrder;