
interface ToasterProps {
  message: string;
  type: 'success' | 'error';
}

const Toaster: React.FC<ToasterProps> = ({ message }) => {
 

  return <div>{message}</div>;
};


export default Toaster;
