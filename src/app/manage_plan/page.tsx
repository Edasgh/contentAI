
import SchematicComponent from "@/components/schematic/SchematicComponent";

const ManagePlan = () => {
  return (
    <div className="p-4 md:p-0 px-8" style={{
        padding:"0 4rem"
    }} >
      <h1 className="text-2xl font-bold mb-4 my-8">Manage Your Plan</h1>
      <p className="text-gray-600 mb-8">
        Manage your subscriptions & billing details here.
      </p>
      <SchematicComponent componentId="cmpn_EUyTGkQ8kUt" />
    </div>
  );
}

export default ManagePlan